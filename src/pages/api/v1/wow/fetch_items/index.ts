import { getToken } from '@/utils/helpers/wowTokenHelper'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

interface AccessToken {
    access_token: string
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const accessToken = await getToken()

        const itemResponse = await axios.get(
            'https://eu.api.blizzard.com/data/wow/media/item/9885?namespace=static-classic-eu&locale=fr_FR',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        console.log('itemResponse', itemResponse.data.assets[0].value)
        res.status(200).json(itemResponse.data.assets[0].value)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching data' })
        }
    }
}
