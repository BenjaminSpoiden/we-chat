import { fetchRedis } from "./fetchRedis"

export const onGetFriendsByUserId = async (userId: string) => {

    const friendIds = await fetchRedis<string[]>('smembers', `user:${userId}:friends`)

    const friends = await Promise.all(
        friendIds.map(async (friendId) => {
            const friends =  await fetchRedis<string>('get', `user:${friendId}`)
            return JSON.parse(friends) as User
        })
    )

    return friends
}