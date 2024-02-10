import { z } from 'zod'

export const AddFriendValidator = z.object({
    email: z.string().email()
})

export const AcceptDenyFriendValidator = z.object({
    id: z.string()
})