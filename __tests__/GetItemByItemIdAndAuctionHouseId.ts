import { PrismaClient } from "@prisma/client"
import { PrismaClient as MyMockPrismaClient } from "../__mocks__/@prisma/client"

jest.mock("@prisma/client", () => ({
    PrismaClient: () => MyMockPrismaClient,
}))

import handler from "../src/pages/api/v2/[itemId]/[auctionHouseId]/index"
import type { NextApiRequest, NextApiResponse } from "next"

const prismaClient = new PrismaClient()

describe("Items API Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("returns item price history successfully", async () => {
        const mockData = [
            { itemId: 25, minBuyout: 88018, snapshotDate: new Date() },
        ]

        ;(prismaClient.prices_history.findMany as jest.Mock).mockResolvedValue(
            mockData
        )

        const req: NextApiRequest = {
            query: { auctionHouseId: "513", itemId: "25" },
        } as unknown as NextApiRequest

        const jsonMock = jest.fn()
        const res = {
            status: jest.fn(() => ({ json: jsonMock })),
        } as unknown as NextApiResponse

        await handler(req, res)

        expect(prismaClient.prices_history.findMany).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(mockData)
    })

    it("handles errors correctly", async () => {
        ;(prismaClient.prices_history.findMany as jest.Mock).mockRejectedValue(
            new Error("Database error")
        )

        const req: Partial<NextApiRequest> = {
            query: { auctionHouseId: "invalid", itemId: "invalid" },
        }

        const jsonMock = jest.fn()
        const resMock = {
            status: jest.fn().mockReturnThis(),
            json: jsonMock,
        } as Partial<NextApiResponse>

        await handler(req as NextApiRequest, resMock as NextApiResponse)

        expect(prismaClient.prices_history.findMany).toHaveBeenCalled()
        expect(resMock.status).toHaveBeenCalledWith(500)
        expect(jsonMock).toHaveBeenCalledWith({ error: "Error fetching data" })
    })
})
