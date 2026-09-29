import * as z from 'zod'

export const RawMessageSchema = z.object({
    type: z.enum([
        'incoming',
        'outgoing'
    ]),

    idMessage: z.string(),

    timestamp: z.number(),

    typeMessage: z.string(),

    chatId: z.string(),

    chatType: z.enum([
        'user',
        'group',
        'supergroup',
        'channel',
        'bot'
    ]),

    textMessage: z.string().optional(),
    downloadUrl: z.string().optional(),
    caption: z.string().optional(),

    senderName: z.string().optional(),

    statusMessage: z
        .enum([
            'sent',
            'delivered',
            'read'
        ])
        .optional(),
})

export const RawMessagesSchema =
    z.array(RawMessageSchema)

export type RawMessage =
    z.infer<typeof RawMessageSchema>

export const ReceiptSchema = z.object({
    receiptId: z.number().int().positive(),
})

export const GreenNotificationSchema = ReceiptSchema.extend({
    body: z.looseObject({ typeWebhook: z.string() }),
})

export const NotificationMessageSchema = z.object({
    typeWebhook: z.enum([
        'incomingMessageReceived',
        'outgoingMessageReceived',
        'outgoingAPIMessageReceived',
    ]),
    idMessage: z.string().min(1),
    timestamp: z.number().positive(),
    senderData: z.object({
        chatId: z.string().min(1),
        chatType: RawMessageSchema.shape.chatType,
        senderName: z.string().optional(),
    }),
    messageData: z.discriminatedUnion('typeMessage', [
        z.object({
            typeMessage: z.literal('textMessage'),
            textMessageData: z.object({ textMessage: z.string() }),
        }),
        z.object({
            typeMessage: z.literal('extendedTextMessage'),
            extendedTextMessageData: z.object({ text: z.string() }),
        }),
        z.object({
            typeMessage: z.literal('imageMessage'),
            fileMessageData: z.object({
                downloadUrl: z.string(),
                caption: z.string().optional(),
            }),
        }),
    ]),
}).transform((body): RawMessage => ({
    type: body.typeWebhook === 'incomingMessageReceived' ? 'incoming' : 'outgoing',
    idMessage: body.idMessage,
    timestamp: body.timestamp,
    chatId: body.senderData.chatId,
    chatType: body.senderData.chatType,
    senderName: body.senderData.senderName,
    typeMessage: body.messageData.typeMessage,
    textMessage: body.messageData.typeMessage === 'textMessage'
        ? body.messageData.textMessageData.textMessage
        : body.messageData.typeMessage === 'extendedTextMessage'
            ? body.messageData.extendedTextMessageData.text
            : body.messageData.fileMessageData.caption,
    ...(body.messageData.typeMessage === 'imageMessage' && {
        downloadUrl: body.messageData.fileMessageData.downloadUrl,
        caption: body.messageData.fileMessageData.caption,
    }),
})).pipe(RawMessageSchema)

export const NotificationResponseSchema = ReceiptSchema.extend({
    message: RawMessageSchema.nullable(),
})
