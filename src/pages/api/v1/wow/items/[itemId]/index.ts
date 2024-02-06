import { getWowApiToken, sanitizeInput } from '@/utils/helpers/'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { itemId } = sanitizeInput(req.query)

    if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required' })
    }

    try {
        const accessToken = await getWowApiToken()

        const [itemResponse, itemMediaResponse] = await Promise.all([
            axios.get(
                `https://eu.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-eu&locale=en_US`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            ),
            axios.get(
                `https://eu.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-classic-eu&locale=en_US`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            ),
        ])

        res.status(200).json({
            itemData: itemResponse.data,
            itemMedia: itemMediaResponse.data,
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching item data' })
        }
    }
}
