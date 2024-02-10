"use client"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/validators/messages"
import { useRef, useState } from "react"
import dayjs from 'dayjs'
import { UserAvatar } from "./UserAvatar"
import Image from "next/image"

type MessagesProps = {
    initialMessages: Message[],
    userId: string,
    userImg: string,
    friendImg: string
}

export const Messages: React.FC<MessagesProps> = ({ initialMessages, userId, userImg, friendImg }) => {

    const [messages, setMessage] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    return (
        <div 
            id="messages" 
            className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scroll-touch"
        >
            <div ref={scrollDownRef} />

            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === userId

                const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId

                return (
                    <div id="chat-message" key={`${message.id}-${message.timestamp}`}>
                        <div className={cn('flex items-end', {
                            'justify-end': isCurrentUser
                        })}>
                            <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start': !isCurrentUser
                            })}>
                                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-indigo-600 text-white': isCurrentUser,
                                    'bg-slate-200 text-slate-900': !isCurrentUser,
                                    'rounedd-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                    'rounded-bl-non': !hasNextMessageFromSameUser && !isCurrentUser
                                })}>
                                    {message.text}{' '}
                                    <span className="ml-2 text-xs text-gray-400">
                                        {dayjs(message.timestamp).format('MMM D, YYYY H:mm')}
                                    </span>
                                </span>
                            </div>

                            <div className={cn('relative w-6 h-6', {
                                'order-2': isCurrentUser,
                                'order-1': !isCurrentUser,
                                'invisible': hasNextMessageFromSameUser
                            })}>
                                <Image 
                                    fill 
                                    src={
                                        isCurrentUser ? userImg : friendImg
                                    }
                                    referrerPolicy="no-referrer"
                                    alt="profile picture"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}