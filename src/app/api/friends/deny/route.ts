import { getSession } from "@/lib/auth";
import { redisDB } from "@/lib/db";
import { z } from "zod";
import { AcceptDenyFriendValidator } from "@/lib/validators/addFriend";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const session = await getSession();

        if(!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { id: idToDeny } = AcceptDenyFriendValidator.parse(body);
        await redisDB.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

        return new Response('OK')

    } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request" + error, { status: 400 });
    }
}