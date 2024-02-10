import { getSession } from '@/lib/auth';
import { redisDB } from '@/lib/db';
import { fetchRedis } from '@/lib/fetchRedis';
import { Message, MessageSendValidator, MessageValidator } from '@/lib/validators/messages';
import { z } from 'zod'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {

    try {
        const session = await getSession()
        if(!session) return new Response('Unauthorized', { status: 401 })


        const body = await req.json()
        const { chatId, text } = MessageSendValidator.parse(body)
        const [userIdOne, userIdTwo] = chatId.split('__')

        if(session.user.id !== userIdOne && session.user.id !== userIdTwo) {
            return new Response("Unauthorized", { status: 401 });
        }

        const friendId = session.user.id === userIdOne ? userIdTwo : userIdOne

        const friendList = await fetchRedis<string[]>('smembers', `user:${session.user.id}:friends`)
        const isFriend = friendList.includes(friendId)

        if(!isFriend) {
            return new Response("Unauthorized", { status: 401 });
        }

        const sender = await fetchRedis<string>('get', `user:${session.user.id}`)
        const parsedSender = JSON.parse(sender) as User
        const timestamp = Date.now()

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp
        }

        const message = MessageValidator.parse(messageData)

        await redisDB.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request" + error, { status: 400 });
    }
}