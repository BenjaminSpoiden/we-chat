"use client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Check, UserPlus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

type FriendRequestsProps = {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {

    const router = useRouter()
    const [friendRequests, setFriendsRequests] = useState<IncomingFriendRequest[]>(
        incomingFriendRequests
    )

    const { mutate: onAcceptFriendRequest } = useMutation({
        mutationFn: async (senderId: string) => {
            const payload = {
                id: senderId
            }
            await axios.post('/api/friends/accept', payload)
        },
        onError: (error, variables) => {
            console.log(error)
            console.log(variables)
        },
        onSuccess: (data, variables, ctx) => {
            setFriendsRequests((prev) => prev.filter(req => req.senderId !== variables))
        } 
    })

    const {mutate: onDenyFriendRequest} = useMutation({
        mutationFn: async (senderId: string) => {
            const payload = {
                id: senderId
            }

            await axios.post('/api/friends/deny', payload)
        },
        onError: (error, variables) => {
            console.log(error)
            console.log(variables)
        },
        onSuccess: (data, variables, ctx) => {
            setFriendsRequests((prev) => prev.filter(req => req.senderId !== variables))
        } 
    })

    return (
        <>
            {
                friendRequests.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                        Nothing here...
                    </p>
                ) : (
                    friendRequests.map(friendRequest => (
                        <div key={friendRequest.senderId} className="flex gap-4 items-center">
                            <UserPlus className="text-black" />
                            <p className="font-medium text-lg "> {friendRequest.senderEmail} </p>
                            <button
                                aria-label="accept friend" 
                                onClick={() => onAcceptFriendRequest(friendRequest.senderId)}
                                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                            >
                                <Check className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                            <button
                                aria-label="deny friend" 
                                onClick={() => onDenyFriendRequest(friendRequest.senderId)}
                                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                            >
                                <X className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                        </div>
                    ))
                )
            }
        </>
    )
}