import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { sanitizeInput } from '../../../../../../utils/helpers'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { auctionHouseId, itemId } = sanitizeInput(req.query)

        const data = await prisma.prices_history.findMany({
            where: {
                auctionHouseId: parseInt(auctionHouseId),
                itemId: parseInt(itemId),
            },
            orderBy: {
                snapshotDate: 'desc',
            },
            take: 20,
        })

        res.status(200).json(data)
    } catch (error) {
        console.error('Request error', error)
        res.status(500).json({ error: 'Error fetching data' })
    } finally {
        await prisma.$disconnect()
    }
}
