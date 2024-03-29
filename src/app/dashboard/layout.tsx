import { FriendRequestSidebarOption } from "@/components/FriendRequestSidebarOption"
import { Icons } from "@/components/Icons"
import { SidebarChatList } from "@/components/SidebarChatList"
import { SignOutButton } from "@/components/SignOutButton"
import { UserAvatar } from "@/components/UserAvatar"
import { getSession } from "@/lib/auth"
import { fetchRedis } from "@/lib/fetchRedis"
import { onGetFriendsByUserId } from "@/lib/requestFriendsId"
import Link from "next/link"
import { notFound } from "next/navigation"

type SidebarOption = {
  id: number,
  name: string,
  href: string,
  Icon: keyof typeof Icons,
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: 'user'
  }
]


export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getSession()
  if(!session) {
    notFound()
  }

  const friends = await onGetFriendsByUserId(session.user.id)
  const unseenRequestCount = (await fetchRedis<User[]>('smembers', `user:${session.user.id}:incoming_friend_requests`)).length

  return (
    <div className="w-full flex h-screen">
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-4">
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <Icons.logo className='h-8 w-auto text-indigo-600' />
        </Link>

          {friends.length > 0 ? <div className='text-xs font-semibold leading-6 text-slate-400'>
            Your chats
          </div> : null}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <SidebarChatList userId={session.user.id} friends={friends} />
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-slate-400">
                  Overview
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sidebarOptions.map((option) => {
                    const Icon = Icons[option.Icon]
                    return (
                      <li key={option.id}>
                        <Link href={option.href} 
                          className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold">
                              <span className="text-slate-400 border-slate-300 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[.625rem] font-medium bg-white">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="truncate">
                                {option.name}
                              </span>
                          </Link>
                      </li>
                    )
                  })}
                  <li>
                    <FriendRequestSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                  </li>
                </ul>
              </li>

              <li className="-mx-6 mt-auto flex items-center">
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-slate-900">
                  <div className="relative h-8 w-8 bg-gray-50">
                    <UserAvatar
                      user={{
                        image: session.user.image,
                        name: session.user.name
                      }}
                    />
                  </div>
                  <span className="sr-only">
                    Your Profile
                  </span>
                  <div className="flex flex-col">
                      <span aria-hidden={true}>
                        {session.user.name}
                      </span>
                      <span className="text-xs text-zinc-400" aria-hidden={true}>
                        {session.user.email}
                      </span>
                  </div>
                </div>
                <SignOutButton className="h-full aspect-square" />
              </li>
            </ul>
          </nav>
      </div>
      {children}
    </div>
  )
}