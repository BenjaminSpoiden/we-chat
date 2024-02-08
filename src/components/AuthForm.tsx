"use client"
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import toast from "react-hot-toast";

export const AuthForm: React.FC<{}> = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onGoogleSignIn = async () => {
        setIsLoading(true)

        try {
            await signIn('google')
        } catch (error) {
            toast.error('There was an error when logging in with Google.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex justify-center')}>
            <Button onClick={onGoogleSignIn} isLoading={isLoading} size="sm" className="w-full">
                { isLoading ? null : <Icons.google className="h-4 w-4 mr-2" /> }
                Sign-in with Google
            </Button>
        </div>
    )
}