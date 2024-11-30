'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { signUp, login } from '../actions/auth'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserEntryPage() {
    const router = useRouter()
    const [signUpState, signUpAction] = useFormState(signUp, null)
    const [loginState, loginAction] = useFormState(login, null)

    useEffect(() => {
        if (signUpState?.success) {
            router.push(`/interest`)
        }
    }, [signUpState, router])
    useEffect(() => {
        if (loginState?.success) {
            router.push(`/flowchart`)
        }
    }, [loginState, router])
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger value="login">Log In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <form action={signUpAction} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" required />
                                {signUpState?.errors?.username && (
                                    <p className="mt-1 text-sm text-red-500">{signUpState.errors.username[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="college">College</Label>
                                <Input id="college" name="college" required />
                                {signUpState?.errors?.college && (
                                    <p className="mt-1 text-sm text-red-500">{signUpState.errors.college[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="usn">USN</Label>
                                <Input id="usn" name="usn" required />
                                {signUpState?.errors?.usn && (
                                    <p className="mt-1 text-sm text-red-500">{signUpState.errors.usn[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                                {signUpState?.errors?.password && (
                                    <p className="mt-1 text-sm text-red-500">{signUpState.errors.password[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                {signUpState?.errors?.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{signUpState.errors.confirmPassword[0]}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">Sign Up</Button>
                        </form>
                        {signUpState?.message && (
                            <p>
                                {signUpState.message}
                            </p>
                        )}
                    </TabsContent>
                    <TabsContent value="login">
                        <form action={loginAction} className="space-y-4">
                            <div>
                                <Label htmlFor="login-usn">USN</Label>
                                <Input id="login-usn" name="usn" required />
                                {loginState?.errors?.usn && (
                                    <p className="mt-1 text-sm text-red-500">{loginState.errors.usn[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" name="password" type="password" required />
                                {loginState?.errors?.password && (
                                    <p className="mt-1 text-sm text-red-500">{loginState.errors.password[0]}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">Log In</Button>
                        </form>
                        {loginState?.message && !loginState.success && (
                            <p className="mt-4 text-center text-red-500">{loginState.message}</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}