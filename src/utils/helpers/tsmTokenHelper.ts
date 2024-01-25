import axios from 'axios'

let cachedToken: {
    value: string | null
    expiry: number | null
} = {
    value: null,
    expiry: null,
}

export async function fetchToken() {
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

export async function getToken() {
    if (!cachedToken.value || Date.now() > (cachedToken.expiry || 0)) {
        return await fetchToken()
    }
    return cachedToken.value
}
