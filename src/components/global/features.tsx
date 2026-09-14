"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  BarChart3,
  Globe,
  GripVertical,
  LayoutGrid,
  Palette,
  Share2,
} from "lucide-react"
import { useRef } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const features = [
  {
    icon: (p: IconProps) => <GripVertical {...p} />,
    title: "Drag, drop, done",
    copy: "Rearrange your entire profile in seconds. No code, no layout math — just move things where they belong.",
  },
  {
    icon: (p: IconProps) => <LayoutGrid {...p} />,
    title: "Modular blocks",
    copy: "Links, images, services, stats, calendars — mix any block, resize it, and make the grid yours.",
  },
  {
    icon: (p: IconProps) => <Palette {...p} />,
    title: "Theme it your way",
    copy: "Colors, fonts, corner radius, backgrounds. Ten ready-made themes or build one from scratch.",
  },
  {
    icon: (p: IconProps) => <BarChart3 {...p} />,
    title: "Know what works",
    copy: "See which blocks get clicked, where visitors come from, and how your profile performs over time.",
  },
  {
    icon: (p: IconProps) => <Share2 {...p} />,
    title: "One link, everywhere",
    copy: "Drop your Cellae URL in your bio, email signature, or QR code. Every update goes live instantly.",
  },
  {
    icon: (p: IconProps) => <Globe {...p} />,
    title: "Your own domain",
    copy: "Serve your profile from yourname.com with SSL, custom metadata, and full SEO out of the box.",
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    },
    { scope: sectionRef }
  )
  return (
    <section className="flex w-full items-center justify-center px-6 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 tracking-widest uppercase">
            Features
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Everything you need to build your corner
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolkit of blocks, themes, and controls — no code, no
            clutter, just the pieces to make it yours.
          </p>
        </div>

        <div
          ref={sectionRef}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, copy }) => (
            <Card key={title} className="p-6">
              <CardHeader className="p-0">
                <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="mt-4 text-base font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm">
                  {copy}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
