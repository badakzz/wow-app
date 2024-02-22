import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getWarcraftLogsApiToken } from '../../../../../utils/helpers'
import { Raid } from '../../../../../utils/types'

export default async function warcraftLogsQueryHandler(
    req: NextApiRequest,
    res: NextApiResponse<Raid[] | { error: string }>
) {
    const { operation, parameters } = req.body

    const getQueryAndResponsePath = (
        operation: string,
        parameters?: {
            raidId?: number
            encounterId?: number
            className?: string
            page?: number
        }
    ) => {
        switch (operation) {
            case 'listRaids':
                return {
                    query: `{ worldData { zones { id name } } }`,
                    responsePath: (data: any) => data.worldData.zones,
                }
            case 'listEncounters':
                console.log(parameters?.raidId)
                return {
                    query: `{ worldData { zone(id: ${parameters?.raidId}) { encounters { id name } } } }`,
                    responsePath: (data: any) => data.worldData.zone.encounters,
                }
            case 'getEncounterDetails':
                return {
                    query: `{ worldData { encounter(id: ${
                        parameters?.encounterId
                    }) { id name characterRankings(className: "${
                        parameters?.className
                    }", page: ${
                        parameters?.page ? parameters?.page : 1
                    }) } } }`,
                    responsePath: (data: any) =>
                        data.worldData.encounter.characterRankings,
                }
            default:
                throw new Error('Invalid operation requested.')
        }
    }

    try {
        const accessToken = await getWarcraftLogsApiToken()

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }

        const { query, responsePath } = getQueryAndResponsePath(
            operation,
            parameters
        )

        const graphqlResponse = await axios.post(
            'https://sod.warcraftlogs.com/api/v2/client',
            JSON.stringify({ query }),
            { headers }
        )

        const responseData = responsePath(graphqlResponse.data.data)

        res.status(200).json(responseData)
    } catch (error: any) {
        if (error.message === 'Invalid operation requested.') {
            res.status(400).json({ error: error.message })
        } else {
            console.error('Failed to fetch data from the GraphQL API:', error)
            res.status(500).json({
                error: 'Failed to fetch data from the GraphQL API.',
            })
        }
    }
}
