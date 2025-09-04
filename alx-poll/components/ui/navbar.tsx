"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">ALX Poll</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/polls" className="text-sm font-medium hover:underline">Polls</Link>
            <Link href="/about" className="text-sm font-medium hover:underline">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/polls/create">
                <Button variant="outline">Create Poll</Button>
              </Link>
              <Link href="/polls/my">
                <Button variant="ghost">My Polls</Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>Log Out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}