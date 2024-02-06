import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { sanitizeInput } from '../../../../utils/helpers'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { hint, limit = '10' } = sanitizeInput(req.query)

        const data = await prisma.items.findMany({
            where: {
                itemName: {
                    contains: hint,
                },
            },
            take: parseInt(limit, 10),
        })

        res.status(200).json(data)
    } catch (error) {
        console.error('Request error', error)
        res.status(500).json({ error: 'Error fetching data' })
    }
}
