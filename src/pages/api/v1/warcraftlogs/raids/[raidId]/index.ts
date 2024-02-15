import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import {
    getWarcraftLogsApiToken,
    sanitizeInput,
} from '../../../../../../utils/helpers'
import { Encounter } from '../../../../../../utils/types'

export default async function warcraftLogsQueryHandler(
    req: NextApiRequest,
    res: NextApiResponse<Encounter[] | { error: string }>
) {
    const { raidId } = sanitizeInput(req.query)

    const query = `
    query {
        worldData {
          zone(id: ${raidId}) {
            encounters {
              id
              name
            }
          }
        }
      }
      `

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
