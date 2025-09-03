"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  // Mock authentication state - will be replaced with actual auth
  const isLoggedIn = false

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
          {isLoggedIn ? (
            <>
              <Link href="/polls/create">
                <Button variant="outline">Create Poll</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Profile</span>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">U</span>
                  </div>
                </Button>
              </Link>
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