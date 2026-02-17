import React from "react"

export default function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Status: {statusCode ?? "—"}</p>
      </div>
    </div>
  )
}
