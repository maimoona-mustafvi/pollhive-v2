"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Hexagon, Mail, Lock, User, ArrowLeft } from "lucide-react"

type Mode = "login" | "signup"

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo flow: proceed to the host dashboard.
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-navy">
            <Hexagon className="size-5 text-lime" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-navy">
            Poll<span className="text-blue">Hive</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-white"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="flex rounded-full bg-canvas p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                  (mode === m ? "bg-navy text-white shadow-sm" : "text-muted-foreground hover:text-navy")
                }
              >
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="mt-7 text-balance text-2xl font-semibold tracking-tight text-navy">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to manage your polls and live sessions."
              : "Start hosting interactive polls in minutes."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {mode === "signup" && (
              <Field icon={User} label="Full name" type="text" placeholder="Maya Anderson" autoComplete="name" />
            )}
            <Field icon={Mail} label="Email" type="email" placeholder="you@company.com" autoComplete="email" />
            <Field
              icon={Lock}
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {mode === "login" && (
              <button type="button" className="self-end text-xs font-medium text-blue hover:underline">
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              className="mt-1 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:brightness-105"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New to PollHive? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-navy hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  type,
  placeholder,
  autoComplete,
}: {
  icon: React.ElementType
  label: string
  type: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-input bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-ring">
        <Icon className="size-4.5 shrink-0 text-muted-foreground" />
        <input
          type={type}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  )
}
