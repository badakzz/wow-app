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
            take: 2,
        })

        if (data.length < 2) {
            res.status(404).json({
                error: 'Not enough data to calculate difference',
            })
            return
        }

        const valueDifference = data[0].marketValue - data[1].marketValue

        res.status(200).json({
            message: 'Success',
            difference: valueDifference,
            mostRecent: data[0],
            secondMostRecent: data[1],
        })
    } catch (error) {
        console.error('Request error', error)
        res.status(500).json({ error: 'Error fetching data' })
    } finally {
        await prisma.$disconnect()
    }
}
