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
        'https://oauth.battle.net/token',
        'grant_type=client_credentials',
        {
            auth: {
                username: process.env.WOW_CLIENT_ID ?? '',
                password: process.env.WOW_SECRET_KEY ?? '',
            },
        }
    )

    const { access_token, expires_in } = response.data
    cachedToken = {
        value: access_token,
        expiry: expires_in * 1000,
    }
    return access_token
}

export async function getToken() {
    if (!cachedToken.value || Date.now() > (cachedToken.expiry || 0)) {
        return await fetchToken()
    }
    return cachedToken.value
}
