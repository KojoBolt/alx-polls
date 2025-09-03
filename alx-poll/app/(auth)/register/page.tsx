"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to start creating polls</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Input type="text" placeholder="Name" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Input type="password" placeholder="Confirm Password" />
            </div>
            <Button className="w-full">Create Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}