import React from "react"
import { Icons } from "./Icons"
import Link from "next/link"
import { AuthForm } from "./AuthForm"

export const Login: React.FC<{}> = () => {

    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className="mx-auto h-6 w-6" />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm max-w-xs mx-auto">
                    Sign in to your account by filling up the form below.
                </p>
                <AuthForm />
                <p className="px-8 text-center text-sm text-zinc-700 max-auto">
                    New here ?{' '}
                    <Link href="/register" className="hover:text-zinc-800 text-sm mx-auto underline underline-offset-4">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}