import { User } from "next-auth"
import React from "react"
import { Avatar, AvatarFallback } from "./Avatar"
import Image from "next/image"
import { Icons } from "./Icons"
import { AvatarProps } from "@radix-ui/react-avatar"

type UserAvatarProps = {
    user: Pick<User, 'name' | 'image'>
} & AvatarProps

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
    return (
        <div>
            <Avatar {...props}>
                {
                    user.image ? (
                        <div className="relative aspect-square h-full w-full">
                            <Image fill src={user.image} alt="profile picture" referrerPolicy="no-referrer" />
                        </div>
                    ) : (
                        <AvatarFallback>
                            <span className="sr-only">
                                { user.name }
                            </span>
                            <Icons.user className="w-4 h-4" />
                        </AvatarFallback>
                    )
                }
            </Avatar>
        </div>
    )
}