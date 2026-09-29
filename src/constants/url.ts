export const messengers = {
    max: { label: 'MAX', apiUrl: 'https://3100.api.green-api.com', typeInstance: 'v3' },
    telegram: { label: 'Telegram', apiUrl: 'https://4100.api.green-api.com', typeInstance: 'telegram' },
} as const

export type Messenger = keyof typeof messengers

export function greenApiUrl(instance: { apiUrl: string; idInstance: string; apiTokenInstance: string }, method: string) {
    return `${instance.apiUrl}/waInstance${encodeURIComponent(instance.idInstance)}/${method}/${encodeURIComponent(instance.apiTokenInstance)}`
}
