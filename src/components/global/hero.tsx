"use client"

import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

export default function Hero() {
  return (
    <section className="relative isolate flex w-full items-center justify-center overflow-hidden px-6 py-16 sm:py-24 min-h-[80vh]">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]",
          "bg-size-[56px_56px] opacity-80",
          "mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-primary)/0.12,transparent)]"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <Badge variant="secondary" className="px-3 py-1">
          <Sparkles data-icon="inline-start" className="size-3.5" />
          Now in public beta
        </Badge>

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Share your everything with{" "}
          <span className="font-syncopate">Cellae</span>
        </h1>

        <p className="mt-5 max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          Build your own corner. On Cellae, design your profile like a game —
          drag cards, resize them, pick your colors. The result: a page
          that&apos;s truly you.
        </p>
      </div>
    </section>
  )
}
