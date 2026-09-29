import { z } from 'zod'
import { messengers } from '@/constants/url'

export const InstanceSchema = z.object({
    messenger: z.enum(['max', 'telegram']),
    idInstance: z.string().trim().regex(/^\d+$/, 'Введите корректный idInstance'),
    apiTokenInstance: z.string().trim().min(1, 'Введите apiTokenInstance').max(512),
}).transform(instance => ({
    ...instance,
    apiUrl: messengers[instance.messenger].apiUrl,
}))

export function parseGreenCookie(value: string | undefined) {
    if (!value) return null
    try {
        const parsed = InstanceSchema.safeParse(JSON.parse(value))
        return parsed.success ? parsed.data : null
    } catch {
        // Совместимость с ранее созданной cookie Telegram.
        const parts = value.split(',').map(part => part.trim())
        if (parts.length !== 2) return null
        const parsed = InstanceSchema.safeParse({
            messenger: 'telegram',
            idInstance: parts[0], apiTokenInstance: parts[1],
        })
        return parsed.success ? parsed.data : null
    }
}
