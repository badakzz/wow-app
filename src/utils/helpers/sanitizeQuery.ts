import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(
    inputObj: Record<string, any>
): Record<string, any> {
    const sanitizedObj: Record<string, any> = {}

    for (const [key, value] of Object.entries(inputObj)) {
        if (typeof value === 'string') {
            sanitizedObj[key] = DOMPurify.sanitize(value)
        } else {
            sanitizedObj[key] = value
        }
    }

    return sanitizedObj
}
