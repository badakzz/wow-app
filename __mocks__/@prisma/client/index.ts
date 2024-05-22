import { jest } from "@jest/globals"

const prismaMock = {
    prices_history: {
        findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
}

export const PrismaClient = jest.fn(() => prismaMock)
