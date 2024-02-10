import { z } from 'zod'

export const MessageValidator = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    timestamp: z.number()
})

export const MessageSendValidator = z.object({
    chatId: z.string(),
    text: z.string()
})

export const MessagesValidator = z.array(MessageValidator)


export type Message = z.infer<typeof MessageValidator>
export type MessageSend = z.infer<typeof MessageSendValidator>