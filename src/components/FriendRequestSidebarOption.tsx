"use client"
import { UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type FriendRequestSidebarProps = {
    sessionId: string
    initialUnseenRequestCount: number
}

export const FriendRequestSidebarOption: React.FC<FriendRequestSidebarProps> = ({
    sessionId,
    initialUnseenRequestCount
}) => {

    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

    return (
        <Link href="/dashboard/request" className="text-slate-700 hover:text-indigo-600 hover:bg-slate-300 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            <div className="text-slate-400 border-slate-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[.625rem] font-medium bg-white">
                <UserIcon className="h-4 w-4" />
            </div>
            <p className="truncate">
                Friend Requests
            </p>
            {
                unseenRequestCount > 0 ? (
                    <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
                        {unseenRequestCount}
                    </div>
                ) : (null) 
            }
        </Link>
    )
}