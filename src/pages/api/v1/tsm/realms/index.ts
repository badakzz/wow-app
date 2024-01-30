import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTsmApiToken } from '../../../../../utils/helpers/'

interface StructuredRealms {
    name: string
    gameVersion: string
    realms: Realm[]
}

interface Realm {
    name: string
    auctionHouses: AuctionHouse[]
}

interface AuctionHouse {
    auctionHouseId: number
    type: string
}

interface ApiResponse {
    items: StructuredRealms[]
}

interface FilteredResult {
    region: string
    gameVersion: string
    realmName: string
    auctionHouseId: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FilteredResult[] | { error: string }>
) {
    try {
        const token = await getTsmApiToken()
        const faction = req.query.faction as string // to sanitize
        const hint = req.query.hint as string // to sanitize and retrieve hint

        const { data } = await axios.get<ApiResponse>(
            'https://realm-api.tradeskillmaster.com/realms',
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const results: FilteredResult[] = data.items.flatMap((item) =>
            item.realms.flatMap((realm) =>
                realm.auctionHouses
                    .filter((auctionHouse) => auctionHouse.type === faction)
                    .filter(
                        (auctionHouse) =>
                            !hint ||
                            realm.name
                                .toLowerCase()
                                .includes(hint.toLowerCase())
                    )
                    .map((auctionHouse) => ({
                        region: item.name,
                        gameVersion: item.gameVersion,
                        realmName: realm.name,
                        auctionHouseId: auctionHouse.auctionHouseId,
                    }))
            )
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
