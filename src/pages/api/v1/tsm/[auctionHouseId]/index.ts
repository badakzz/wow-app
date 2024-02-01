import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTsmApiToken, sanitizeInput } from '../../../../../utils/helpers'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<[] | { error: string }>
) {
    try {
        const token = await getTsmApiToken()
        const { auctionHouseId } = sanitizeInput(req.query)
        console.log('ah, item', { token })

        const { data } = await axios.get(
            `https://pricing-api.tradeskillmaster.com/ah/${auctionHouseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        console.log(data)
        res.status(200).json(data)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching data' })
        }
    }
}
