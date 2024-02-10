import { ChatInput } from "@/components/ChatInput"
import { Messages } from "@/components/Messages"
import { getSession } from "@/lib/auth"
import { fetchRedis } from "@/lib/fetchRedis"
import { Message, MessagesValidator } from "@/lib/validators/messages"
import Image from "next/image"
import { notFound } from "next/navigation"

type PageProps = {
    params: {
        chatId: string
    }
}

const onGetChatMessage = async (chatId: string) => {
    try {
        const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1) 
        const dbMessages = results.map(message => JSON.parse(message) as Message)

        const reverseMessages = dbMessages.reverse()
        const messages = MessagesValidator.parse(reverseMessages)

        return messages
    } catch (error) {
        console.error(error)
    }

}

const ChatPage: React.FC<PageProps> = async ({ params }) => {

    const { chatId } = params
    const session = await getSession()
    if(!session) notFound()
    const { user } = session

    const [userIdOne, userIdTwo] = chatId.split('__')
    if(user.id !== userIdOne && user.id !== userIdTwo){ 
        notFound()
    }

    const chatFriendId = user.id === userIdOne ? userIdTwo : userIdOne
    
    const chatFriendDB = await fetchRedis<string>('get', `user:${chatFriendId}`)
    const chatFriend = JSON.parse(chatFriendDB) as User
    const initialMessages = await onGetChatMessage(chatId)

    return (
        <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-slate-200">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                            <Image 
                                fill 
                                referrerPolicy="no-referrer" 
                                src={chatFriend.image} 
                                alt={`${chatFriend.name}'s profile picture`} 
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-slate-700 mr-3 font-semibold">
                                {chatFriend.name}
                            </span>
                        </div>
                        <span className="text-sm text-slate-600">
                            {chatFriend.email}
                        </span>
                    </div>
                </div>
            </div>
            <Messages 
                initialMessages={initialMessages || []} 
                userId={user.id} 
                friendImg={chatFriend.image}
                userImg={user.image || ""}
            />
            <ChatInput chatFriendName={chatFriend.name} chatId={chatId}/>
        </div>
    )
}


export default ChatPage