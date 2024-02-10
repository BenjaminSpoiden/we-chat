"use client"
import { onConstructChatHref } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type SidebarChatListProps = {
    friends: User[],
    userId: string
}

export const SidebarChatList: React.FC<SidebarChatListProps> = ({ friends, userId }) => {

    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessage, setUnseenMessages] = useState<Message[]>([])

    useEffect(() => {
        if(pathname.includes('chat')) {
            setUnseenMessages((prev) => prev.filter(msg => !pathname.includes(msg.senderId)))
        }
    }, [pathname])

    return (
        <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
            {
                friends.sort().map(friend => {
                    const unseenMessageCount = unseenMessage.filter(unseenMsg => {
                        return unseenMsg.senderId === friend.id
                    }).length


                    return (
                        <li key={friend.id}>
                            <a 
                                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-500 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                href={`/dashboard/chat/${onConstructChatHref(userId, friend.id)}`}
                            >
                                { friend.name }
                                { unseenMessageCount > 0 ? (
                                    <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                        {
                                            unseenMessageCount
                                        }
                                    </div>
                                ) : null }
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}