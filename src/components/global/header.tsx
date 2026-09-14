"use client"
import { ArrowRight, Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AnimatedThemeToggler } from "../util/animated-theme-toggler"

const navLinks = [
  { name: "Pricing", link: "/pricing" },
  { name: "About", link: "/about" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-6">
        <Link
          href="/"
          className="text-md flex items-end gap-2 font-syncopate font-bold tracking-tight"
        >
          cellae
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ name, link }) => (
            <Link
              key={name}
              href={link}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-8">
          <AnimatedThemeToggler />
          <Button
            render={<Link href="/app">Go to App</Link>}
            nativeButton={false}
            className="hidden md:inline-flex"
          >
            Go to App
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden" />
              }
              aria-label="Open menu"
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-md font-bold font-syncopate tracking-tight">
                  cellae
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-2">
                {navLinks.map(({ name, link }) => (
                  <SheetClose
                    key={link}
                    render={<Link href={link}>{name}</Link>}
                    nativeButton={false}
                    className="rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {name}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <Button
                  render={<Link href="/app">Go to App</Link>}
                  nativeButton={false}
                  className="w-full"
                >
                  Go to App
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
