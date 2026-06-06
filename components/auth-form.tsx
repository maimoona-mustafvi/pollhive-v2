"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Hexagon, Mail, Lock, User, ArrowLeft, Check } from "lucide-react"

type Mode = "login" | "signup"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? "/dashboard"

  const [mode, setMode] = useState<Mode>("login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, fullName }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      router.push(from)
      router.refresh()
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      {/* Decorative accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-blue/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-96 rounded-full bg-blue/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-lime">
            <Hexagon className="size-5 text-navy" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Poll<span className="text-lime">Hive</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
          {/* Left brand panel */}
          <div className="hidden flex-col gap-6 lg:flex">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-lime">
              <span className="size-1.5 rounded-full bg-lime" />
              Live polling for teams
            </div>
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white">
              Run live quizzes and votes your audience actually enjoys.
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                "Launch a poll in under a minute",
                "Watch results update in real time",
                "No sign-up required for participants",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-lime">
                    <Check className="size-3 text-navy" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right auth card */}
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
            <div className="flex rounded-full bg-canvas p-1">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setError(null) }}
                  className={
                    "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                    (mode === m
                      ? "bg-navy text-white shadow-sm"
                      : "text-muted-foreground hover:text-navy")
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

            {error && (
              <div className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {mode === "signup" && (
                <Field
                  icon={User}
                  label="Full name"
                  type="text"
                  placeholder="Maya Anderson"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              <Field
                icon={Mail}
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Field
                icon={Lock}
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-full bg-lime px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-all hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New to PollHive? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null) }}
                className="font-semibold text-navy hover:underline"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
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
  value,
  onChange,
  required,
}: {
  icon: React.ElementType
  label: string
  type: string
  placeholder: string
  autoComplete?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-input bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-ring">
        <Icon className="size-4.5 shrink-0 text-muted-foreground" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  )
}
