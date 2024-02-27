import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { sanitizeInput } from '../../../../../../utils/helpers'
import { format, parseISO } from 'date-fns' // assuming you've added date-fns to your project

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
                snapshotDate: 'asc',
            },
        })

        const formattedData = data.map((entry: any) => ({
            ...entry,
            snapshotDate: format(
                parseISO(entry.snapshotDate),
                "yyyy-MM-dd'T'HH:mm"
            ),
        }))
        console.log(formattedData)
        res.status(200).json(formattedData)
    } catch (error) {
        console.error('Request error', error)
        res.status(500).json({ error: 'Error fetching data' })
    } finally {
        await prisma.$disconnect()
    }
}
