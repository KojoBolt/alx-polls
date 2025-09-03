"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function PollDetailPage({ params }: { params: { id: string } }) {
  // Mock data - will be replaced with actual data fetching
  const poll = {
    id: params.id,
    title: params.id === "1" ? "Favorite Programming Language" : "Sample Poll",
    description: "Select your preferred option below",
    options: [
      { id: "1", text: "JavaScript", votes: 15 },
      { id: "2", text: "Python", votes: 12 },
      { id: "3", text: "Java", votes: 8 },
      { id: "4", text: "C#", votes: 7 },
    ],
    totalVotes: 42,
    created: "2023-05-15",
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/polls">
          <Button variant="outline" size="sm">
            ← Back to Polls
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <RadioGroup defaultValue="">
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-4 p-3 border rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votes ({Math.round((option.votes / poll.totalVotes) * 100)}%)
                  </span>
                </div>
              ))}
            </RadioGroup>
            <Button className="w-full mt-4">Submit Vote</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div>Total votes: {poll.totalVotes}</div>
          <div>Created on {poll.created}</div>
        </CardFooter>
      </Card>
    </div>
  )
}