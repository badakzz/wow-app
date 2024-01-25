import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../../../utils/helpers/tsmTokenHelper'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const token = await getToken()

        const realmsResponse = await axios.get(
            'https://realm-api.tradeskillmaster.com/realms',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        res.status(200).json(realmsResponse.data)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching data' })
        }
    }
}
