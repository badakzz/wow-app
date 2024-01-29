import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTsmApiToken } from '../../../../../utils/helpers/'

interface Realm {
    name: string
    gameVersion: string
    realms: RealmDetails[]
}

interface RealmDetails {
    name: string
    auctionHouses: AuctionHouse[]
}

interface AuctionHouse {
    auctionHouseId: number
    type: string
}

interface Result {
    itemName: string
    gameVersion: string
    realmName: string
    auctionHouses: {
        faction: string
        auctionHouseId: number
    }[]
}

interface ApiResponse {
    items: Realm[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result[] | { error: string }>
) {
    try {
        const token = await getTsmApiToken()

        const { data } = await axios.get<ApiResponse>(
            'https://realm-api.tradeskillmaster.com/realms',
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const results: Result[] = data.items.flatMap((item) =>
            item.realms.map((realm) => ({
                itemName: item.name,
                gameVersion: item.gameVersion,
                realmName: realm.name,
                auctionHouses: realm.auctionHouses.map((auctionHouse) => ({
                    faction: auctionHouse.type,
                    auctionHouseId: auctionHouse.auctionHouseId,
                })),
            }))
        )

        res.status(200).json(results)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching data' })
        }
    }
}
