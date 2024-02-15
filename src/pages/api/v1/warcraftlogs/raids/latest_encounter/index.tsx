import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getWarcraftLogsApiToken } from '../../../../../../utils/helpers'

interface Zone {
    id: number
    name: string
    encounters: Encounter[]
}

interface Encounter {
    id: number
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Encounter[] | { error: string }>
) {
    const query = `
    query {
      worldData {
        zones {
          id
          name
          encounters {
            id
            name
          }
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

        const zones = graphqlResponse.data.data.worldData.zones

        const latestZone = zones.reduce((prev: Zone, current: Zone) =>
            prev.id > current.id ? prev : current
        )

        const encounters: Encounter[] = latestZone.encounters.map(
            (encounter: Encounter) => {
                return { id: encounter.id, name: encounter.name }
            }
        )

        console.log(encounters)

        res.status(200).json(encounters)
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
