const AWS = require("aws-sdk")
const s3 = new AWS.S3()
const logs = new AWS.CloudWatchLogs()

exports.handler = async (event) => {
    const bucketName = event.Records[0].s3.bucket.name
    const key = decodeURIComponent(
        event.Records[0].s3.object.key.replace(/\+/g, " ")
    )

    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        }
        const data = await s3.getObject(params).promise()

        const logData = data.Body.toString("utf-8")
        await sendToCloudWatch(logData)
    } catch (err) {
        console.error("Error processing S3 object:", err)
        throw err
    }
}

async function sendToCloudWatch(logData) {
    const params = {
        logGroupName: process.env.LOG_GROUP_NAME,
        logStreamName: "lbLogStream",
        logEvents: [
            {
                timestamp: new Date().getTime(),
                message: logData,
            },
        ],
    }
    await logs.putLogEvents(params).promise()
}
