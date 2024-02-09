"use client"

import { AddFriendValidator } from "@/lib/validators/addFriend"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./Input"
import { Button } from "./Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./Form"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import toast from "react-hot-toast"

type AddFriendButtonProps = {}

type FormData = z.infer<typeof AddFriendValidator>

export const AddFriendButton: React.FC<AddFriendButtonProps> = () => {

    const form = useForm<FormData>({
        resolver: zodResolver(AddFriendValidator),
        defaultValues: {
            email: ""
        }
    })

    const {mutate: onSendFriendRequest, isPending} = useMutation({
        mutationFn: async ({ email }: FormData) => {
            
            const validateEmail = AddFriendValidator.parse({ email })
            await axios.post('/api/friends/add', {
                email: validateEmail
            })
        },
        onSuccess: (data, variables, context) => {
            console.log('SUCCESSFULL')
        },
        onError: (error, variables, context) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (values: FormData) => {
        onSendFriendRequest({email: values.email})
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                This will send a friend request.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" isLoading={isPending}>Send Friend Request</Button>
            </form>
        </Form>
    )
}