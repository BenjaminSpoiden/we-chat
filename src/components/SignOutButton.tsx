'use client'
import { ButtonHTMLAttributes } from "react"
import { Button } from "./Button"
import { useMutation } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

type SignOuntButtonProps = {} & ButtonHTMLAttributes<HTMLButtonElement>

export const SignOutButton: React.FC<SignOuntButtonProps> = ({ ...props }) => {

    const { mutate: onSignOut, isPending } = useMutation({
        mutationFn: async () => {
            await signOut()
        },
        onSuccess: () => {
            console.log('SUCCESS')
        },
        onError: (error) => {
            console.log('ERROR LOGGING OUT', error.message)
        }
    })
    return (
       <Button {...props} variant='ghost' isLoading={isPending} onClick={() => onSignOut()}>
         <LogOut className="w-4 h-4" />
       </Button>
    )
}