import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getWarcraftLogsApiToken } from '../../../../../../utils/helpers'

interface Raid {
    id: number
    name: string
}

export default async function warcraftLogsQueryHandler(
    req: NextApiRequest,
    res: NextApiResponse<Raid[] | { error: string }>
) {
    const query = `
    query {
      worldData {
        zones {
          id
          name
        }
      }
    }`

    try {
        const accessToken = await getWarcraftLogsApiToken()

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }

        const graphqlResponse = await axios.post(
            'https://sod.warcraftlogs.com/api/v2/client',
            JSON.stringify({ query }),
            { headers }
        )

        res.status(200).json(graphqlResponse.data.data.worldData.zones)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({
                error: 'Failed fetching data from Warcraft Logs',
            })
        }
    }
}
