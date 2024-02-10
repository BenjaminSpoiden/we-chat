import { FriendRequests } from "@/components/FriendRequests"
import { getSession } from "@/lib/auth"
import { fetchRedis } from "@/lib/fetchRedis"
import { notFound } from "next/navigation"


type RequestPageProps = {}

const RequestsPage: React.FC<RequestPageProps> = async () => {
    const session = await getSession()
    if(!session) notFound()

    const incomingSenderIds = await fetchRedis<string[]>('smembers', `user:${session.user.id}:incoming_friend_requests`)

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await fetchRedis<string>('get', `user:${senderId}`)
            const parsedSender = JSON.parse(sender) as User
            return {
                senderId,
                senderEmail: parsedSender.email
            }
        })
    )


    return (
        <main className="pt-8">
            <h1 className='font-bold text-5xl mb-8'>
                Add Friend
            </h1>

            <div className="flex flex-col gap-4">
                <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
            </div>
        </main>
    )
}

export default RequestsPage