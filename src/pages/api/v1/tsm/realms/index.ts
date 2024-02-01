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
    auctionHouses: RawAuctionHouse[]
}

interface RawAuctionHouse {
    auctionHouseId: number
    type: string
}

interface ApiResponse {
    items: StructuredRealms[]
}

interface AuctionHouse {
    realmName: string
    auctionHouseId: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AuctionHouse[] | { error: string }>
) {
    try {
        const token = await getTsmApiToken()
        const faction = req.query.faction as string // to sanitize
        const region = req.query.region as string // to sanitize
        const hint = req.query.hint as string // to sanitize and retrieve hint

        const { data } = await axios.get<ApiResponse>(
            'https://realm-api.tradeskillmaster.com/realms',
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const results: AuctionHouse[] = data.items
            .filter((item) => item.gameVersion === 'Season of Mastery')
            .filter((item) => item.name === region)
            .flatMap((item) =>
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
                            realmName: realm.name,
                            auctionHouseId: auctionHouse.auctionHouseId,
                        }))
                )
            )

        console.log(results)
        res.status(200).json(results)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({ error: 'Failed fetching data' })
        }
    }
}
