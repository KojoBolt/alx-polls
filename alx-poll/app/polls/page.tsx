"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PollsPage() {
  // Mock data - will be replaced with actual data fetching
  const polls = [
    {
      id: "1",
      title: "Favorite Programming Language",
      description: "What programming language do you prefer to use?",
      votes: 42,
      created: "2023-05-15",
    },
    {
      id: "2",
      title: "Best Frontend Framework",
      description: "Which frontend framework do you think is the best?",
      votes: 36,
      created: "2023-05-10",
    },
    {
      id: "3",
      title: "Remote Work Preference",
      description: "Do you prefer working remotely or in an office?",
      votes: 28,
      created: "2023-05-05",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle>{poll.title}</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {poll.votes} votes · Created on {poll.created}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/polls/${poll.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}