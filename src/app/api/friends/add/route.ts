import { getSession } from "@/lib/auth"
import { redisDB } from "@/lib/db"
import { fetchRedis } from "@/lib/fetchRedis"
import { pusherServer } from "@/lib/messagePusher"
import { toPusherKey } from "@/lib/utils"
import { AddFriendValidator } from "@/lib/validators/addFriend"
import { z } from "zod"


export async function POST(req: Request) {

    try {
        const body = await req.json()
        const { email: newEmail} = AddFriendValidator.parse(body.email)

        const newId = await fetchRedis<string>('get', `user:email:${newEmail}`)
        
        if (!newId) {
          return new Response("This person does not exist", { status: 400 });
        }

        const session = await getSession()

        if(!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        if(newId === session.user.id) {
            return new Response('You cannot add yourself as a friend', { status: 400 })
        }

        const isUserAlreadyAdded = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:friends`, session.user.id)
        if (isUserAlreadyAdded) {
          return new Response("Already added this user", { status: 400 });
        }

        const isUserAlreadyFriend = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:friends`, newId)

        if (isUserAlreadyFriend) {
          return new Response("Already friends with this user", {
            status: 400,
          });
        }

        //IF Valid
        await pusherServer.trigger(
          toPusherKey(`user:${newId}:incoming_friend_requests`), 
          'incoming_friend_requests',
          { senderId: session.user.id, senderEmail: session.user.email }
        )

        await redisDB.sadd(
          `user:${newId}:incoming_friend_requests`,
          session.user.id
        );

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}