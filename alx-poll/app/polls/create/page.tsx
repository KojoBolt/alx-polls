"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePollPage() {
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
          <CardTitle>Create New Poll</CardTitle>
          <CardDescription>Fill in the details below to create your poll</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Poll Title</label>
              <Input placeholder="Enter your question" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Provide additional context for your poll (optional)" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                <Input placeholder="Option 1" />
                <Input placeholder="Option 2" />
                <Input placeholder="Option 3" />
                <Input placeholder="Option 4" />
              </div>
              <Button type="button" variant="outline" className="w-full">
                + Add Another Option
              </Button>
            </div>

            <Button className="w-full">Create Poll</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}