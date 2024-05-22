"use strict"

const aws = require("aws-sdk")
const zlib = require("zlib")
const s3 = new aws.S3({ apiVersion: "2006-03-01" })
const cloudWatchLogs = new aws.CloudWatchLogs({
    apiVersion: "2014-03-28",
})

const readline = require("readline")
const stream = require("stream")

let logGroupName = process.env.logGroupName
let logStreamName

exports.handler = (event, context, callback) => {
    logStreamName = context.logStreamName
    const bucket = event.Records[0].s3.bucket.name
    const key = decodeURIComponent(
        event.Records[0].s3.object.key.replace(/\+/g, " ")
    )

    // Retrieve S3 Object based on the bucket and key name in the event parameter
    const params = {
        Bucket: bucket,
        Key: key,
    }
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err)
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`
            console.log(message)
            callback(message)
        } else {
            zlib.gunzip(data.Body, function (error, buffer) {
                if (error) {
                    console.log("Error uncompressing data", error)
                    return
                }

                const logData = buffer.toString("ascii")
                manageLogGroups(logData)
            })
            callback(null, data.ContentType)
        }
    })

    // Manage the log group
    function manageLogGroups(logData) {
        const describeLogGroupParams = {
            logGroupNamePrefix: logGroupName,
        }

        cloudWatchLogs.describeLogGroups(
            describeLogGroupParams,
            function (err, data) {
                if (err) {
                    console.log("Error while describing log group:", err)
                    createLogGroup(logData)
                } else {
                    if (!data.logGroups[0]) {
                        createLogGroup(logData)
                    } else {
                        manageLogStreams(logData)
                    }
                }
            }
        )
    }

    // Create log group
    function createLogGroup(logData) {
        const logGroupParams = {
            logGroupName: logGroupName,
        }
        cloudWatchLogs.createLogGroup(logGroupParams, function (err, data) {
            if (err) {
                console.log("error while creating log group: ", err, err.stack)
                return
            } else {
                manageLogStreams(logData)
            }
        })
    }

    // Manage the log stream and get the sequenceToken - The sequence token is the order of the logs being added to the stream
    function manageLogStreams(logData) {
        const describeLogStreamsParams = {
            logGroupName: logGroupName,
            logStreamNamePrefix: logStreamName,
        }

        cloudWatchLogs.describeLogStreams(
            describeLogStreamsParams,
            function (err, data) {
                if (err) {
                    console.log("Error during describe log streams:", err)
                    createLogStream(logData)
                } else {
                    if (!data.logStreams[0]) {
                        console.log("Need to  create log stream:", data)
                        createLogStream(logData)
                    } else {
                        console.log(
                            "Log Stream already defined:",
                            logStreamName
                        )
                        putLogEvents(
                            data.logStreams[0].uploadSequenceToken,
                            logData
                        )
                    }
                }
            }
        )
    }

    // Create Log Stream
    function createLogStream(logData) {
        const logStreamParams = {
            logGroupName: logGroupName,
            logStreamName: logStreamName,
        }

        cloudWatchLogs.createLogStream(logStreamParams, function (err, data) {
            if (err) {
                console.log("error while creating log stream: ", err, err.stack)
                return
            } else {
                console.log("Success in creating log stream: ", logStreamName)
                putLogEvents(null, logData)
            }
        })
    }

    function putLogEvents(sequenceToken, logData) {
        const MAX_BATCH_SIZE = 1048576
        const MAX_BATCH_COUNT = 10000
        const LOG_EVENT_OVERHEAD = 26

        const batches = []
        let batch = []
        let batch_size = 0

        const bufferStream = new stream.PassThrough()
        bufferStream.end(logData)
        const rl = readline.createInterface({ input: bufferStream })

        rl.on("line", (line) => {
            if (line[0] !== "#") {
                const parts = line.split(" ")

                console.log("Log line:", line)

                const timeValue = new Date(parts[1]).getTime()
                const httpMethod = parts[12]
                const url = parts[13]
                const statusCode = parts[8]
                const requestTime = parts[4]

                const formattedMessage = `Method: ${httpMethod}, URL: ${url}, Status: ${statusCode}, RequestTime: ${requestTime}`
                const event_size = formattedMessage.length + LOG_EVENT_OVERHEAD

                console.log("Formatted message:", formattedMessage)

                batch_size += event_size
                if (
                    batch_size >= MAX_BATCH_SIZE ||
                    batch.length >= MAX_BATCH_COUNT
                ) {
                    batches.push(batch)
                    batch = []
                    batch_size = event_size
                }

                batch.push({
                    message: formattedMessage,
                    timestamp: timeValue,
                })
            }
        })

        rl.on("close", () => {
            if (batch.length > 0) {
                batches.push(batch)
            }
            sendBatches(sequenceToken, batches)
        })
    }

    function sendBatches(sequenceToken, batches) {
        let count = 0
        let batch_count = 0

        function sendNextBatch(err, nextSequenceToken) {
            if (err) {
                console.log("Error sending batch: ", err, err.stack)
                return
            } else {
                const nextBatch = batches.shift()
                if (nextBatch) {
                    ++batch_count
                    count += nextBatch.length
                    sendBatch(nextSequenceToken, nextBatch, sendNextBatch)
                } else {
                    const msg = `Successfully put ${count} events in ${batch_count} batches`
                    console.log(msg)
                    callback(null, msg)
                }
            }
        }

        sendNextBatch(null, sequenceToken)
    }

    function sendBatch(sequenceToken, batch, doNext) {
        const putLogEventParams = {
            logEvents: batch,
            logGroupName: logGroupName,
            logStreamName: logStreamName,
        }
        if (sequenceToken) {
            putLogEventParams["sequenceToken"] = sequenceToken
        }

        putLogEventParams.logEvents.sort(function (a, b) {
            if (a.timestamp > b.timestamp) {
                return 1
            }
            if (a.timestamp < b.timestamp) {
                return -1
            }
            return 0
        })

        cloudWatchLogs.putLogEvents(putLogEventParams, function (err, data) {
            if (err) {
                console.log("Error during put log events: ", err, err.stack)
                doNext(err, null)
            } else {
                doNext(null, data.nextSequenceToken)
            }
        })
    }
}
