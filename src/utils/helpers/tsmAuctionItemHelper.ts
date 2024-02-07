export function minutesSinceTimestamp(timestamp: string): string {
    const timestampDate = new Date(timestamp).getTime()
    const now = new Date().getTime()
    const difference = now - timestampDate

    const minutes = Math.floor(difference / 60000)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    let result = 'Last scan: '
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? 's' : ''} `
    }
    if (remainingMinutes > 0) {
        result += `${remainingMinutes} minute${
            remainingMinutes > 1 ? 's' : ''
        } `
    }
    result += 'ago'

    return result
}

export function formatRawPriceToCopperSilverGold(
    rawPrice: number
): { copper: number; silver: number; gold: number } | null {
    return rawPrice > 0
        ? {
              gold: Math.floor(rawPrice / 10000),
              silver: Math.floor((rawPrice % 10000) / 100),
              copper: rawPrice % 100,
          }
        : null
}
