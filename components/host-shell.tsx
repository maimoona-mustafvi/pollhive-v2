"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Hexagon,
  Search,
  Bell,
} from "lucide-react"

type NavKey = "dashboard" | "create" | "polls" | "settings"

const NAV: { key: NavKey; label: string; href: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "create", label: "Create Poll", href: "/create", icon: PlusCircle },
  { key: "polls", label: "My Polls", href: "/my-polls", icon: ListChecks },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings },
]

export function HostShell({
  active,
  title,
  subtitle,
  action,
  children,
}: {
  active: NavKey
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime">
            <Hexagon className="size-5 text-navy" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              Poll<span className="text-lime">Hive</span>
            </span>
          )}
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const isActive = item.key === active
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-white/75 hover:bg-sidebar-accent hover:text-white",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-4">
          {!collapsed && (
            <div className="mb-3 rounded-xl bg-sidebar-accent/60 p-3">
              <p className="text-xs font-medium text-white/70">Acme Inc — Pro plan</p>
              <p className="mt-1 text-xs text-white/50">8 of 25 polls used</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-sidebar-accent hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="size-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-navy">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm text-muted-foreground shadow-sm md:flex">
              <Search className="size-4" />
              <span>Search polls</span>
            </div>
            <button className="relative flex size-10 items-center justify-center rounded-full bg-white text-navy shadow-sm">
              <Bell className="size-4.5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-lime ring-2 ring-white" />
            </button>
            <div className="flex size-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              AM
            </div>
            {action}
          </div>
        </header>

        <main className="flex-1 px-6 pb-12 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
