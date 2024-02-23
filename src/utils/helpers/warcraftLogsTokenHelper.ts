import axios from 'axios'

let cachedToken: { value: string | null; expiry: number | null } = {
    value: null,
    expiry: null,
}

export async function fetchWarcraftLogsApiToken() {
    try {
        const auth = Buffer.from(
            `${process.env.WARCRAFT_LOGS_CLIENT_ID}:${process.env.WARCRAFT_LOGS_CLIENT_SECRET}`
        ).toString('base64')

        const response = await axios.post(
            'https://www.warcraftlogs.com/oauth/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        const { access_token, expires_in } = response.data
        cachedToken = {
            value: access_token,
            expiry: Date.now() + expires_in * 1000,
        }
        return access_token
    } catch (error) {
        console.error('Error fetching Warcraft Logs API token:', error)
        throw error
    }
}

export async function getWarcraftLogsApiToken() {
    if (!cachedToken.value || Date.now() > (cachedToken.expiry || 0)) {
        return await fetchWarcraftLogsApiToken()
    }
    return cachedToken.value
}
