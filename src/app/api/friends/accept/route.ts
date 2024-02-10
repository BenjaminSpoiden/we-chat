import { getSession } from '@/lib/auth'
import { redisDB } from '@/lib/db'
import { fetchRedis } from '@/lib/fetchRedis'
import { AcceptDenyFriendValidator } from '@/lib/validators/addFriend'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const body = await req.json()
       
        const { id: friendIdToAdd } = AcceptDenyFriendValidator.parse(body)
        
        const session = await getSession()
        if(!session) return new Response('Unauthorized', { status: 401 })

        const isAlreadyFriend = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:friends`, friendIdToAdd)
        if(isAlreadyFriend) {
            return new Response('You are already friend with this user.', { status: 400 })
        }

        const hasFriendRequest = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:incoming_friend_requests`, friendIdToAdd)

        if(!hasFriendRequest) {
            return new Response('No friend request', { status: 400 })
        }

        await redisDB.sadd(`user:${session.user.id}:friends`, friendIdToAdd)
        await redisDB.sadd(`user:${friendIdToAdd}:friends`, session.user.id)
        await redisDB.srem(`user:${session.user.id}:incoming_friend_requests`, friendIdToAdd)

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request" + error, { status: 400 });
    }
} 