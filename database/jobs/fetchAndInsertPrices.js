const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const { logger } = require('../../next-logger.config.js')

const prisma = new PrismaClient()

let cachedToken = {
    value: null,
    expiry: null,
}

const fetchTsmApiToken = async () => {
    const response = await axios.post(
        'https://auth.tradeskillmaster.com/oauth2/token',
        {
            client_id: process.env.TSM_CLIENT_ID,
            grant_type: 'api_token',
            scope: 'app:realm-api app:pricing-api',
            token: process.env.TSM_API_KEY,
        }
    )

    const { access_token, expires_at } = response.data
    cachedToken = {
        value: access_token,
        expiry: expires_at * 1000,
    }
    return access_token
}

const getTsmApiToken = async () => {
    if (!cachedToken.value || Date.now() > (cachedToken.expiry || 0)) {
        return await fetchTsmApiToken()
    }
    return cachedToken.value
}

const fetchAndSavePricingData = async () => {
    try {
        console.log('Retrieving token...')
        const token = await getTsmApiToken()

        console.log('Fetching the TSM API...')

        const pricingResponse = await axios.get(
            'https://pricing-api.tradeskillmaster.com/ah/513',
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        const pricingData = pricingResponse.data

        console.log('Inserting data...')
        for (const item of pricingData) {
            await prisma.prices_history.create({
                data: {
                    itemId: item.itemId,
                    snapshotDate: new Date().toISOString(),
                    auctionHouseId: item.auctionHouseId,
                    minBuyout: item.minBuyout,
                    quantity: item.quantity,
                    marketValue: item.marketValue,
                    historical: item.historical,
                    numAuctions: item.numAuctions,
                },
            })
        }
    } catch (error) {
        console.error('An error occurred:', error)
    } finally {
        console.log(`Insert done on ${new Date().toISOString()}`)

        await prisma.$disconnect()
    }
}

fetchAndSavePricingData()
