"use client"

import { useRef, useState } from "react"
import { Button } from "./Button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { MessageSend } from "@/lib/validators/messages"

type ChatInputProps = {
    chatFriendName: string,
    chatId: string
}

export const ChatInput: React.FC<ChatInputProps> = ({ chatFriendName, chatId }) => {
    //TODO: Editor.js
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>('')


    const {mutate: onSendMessage, isPending} = useMutation({
        mutationFn: async () => {
            const payload: MessageSend = {
                text: input,
                chatId
            }
            await axios.post('/api/message/send', payload)
        },
        onSuccess: () => {
            setInput('')
            textAreaRef.current?.focus()
        },
        onError: () => {
            console.log('PROBLEM')
        }
    })

    return (
        <div className="border-t border-slate-200 px-4 pt-4 mb-2 sm:mb-0">
            <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <textarea 
                    ref={textAreaRef} 
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            onSendMessage()
                        }
                    }} 
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${chatFriendName}`}
                    className="block w-full resize-none border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                />
                <div onClick={() => textAreaRef.current?.focus()} className="py-2" aria-hidden="true">
                    <div className="py-px">
                        <div className="h-9" />
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex-shrink-0">
                        <Button onClick={() => onSendMessage()} isLoading={isPending} type="submit">
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}