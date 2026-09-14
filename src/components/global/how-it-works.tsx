"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { LayoutGrid, Palette, Share2, UserPlus } from "lucide-react"
import { useRef } from "react"

import { Badge } from "@/components/ui/badge"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const steps = [
  {
    icon: (p: IconProps) => <UserPlus {...p} />,
    title: "Claim your handle",
    copy: "Sign up in seconds and pick your Cellae URL. No credit card, no setup — your page is live the moment you choose a name.",
  },
  {
    icon: (p: IconProps) => <LayoutGrid {...p} />,
    title: "Build your grid",
    copy: "Drop in blocks — links, images, services, stats, calendars. Drag them around, resize them, and shape a layout that fits you.",
  },
  {
    icon: (p: IconProps) => <Palette {...p} />,
    title: "Make it yours",
    copy: "Pick a theme or design one from scratch. Colors, fonts, radius, background — every detail is under your control.",
  },
  {
    icon: (p: IconProps) => <Share2 {...p} />,
    title: "Share one link",
    copy: "Paste your Cellae URL in your bio, email signature, or QR code. Every edit goes live instantly, everywhere.",
  },
]
export default function HowItWorks() {
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
    <section
      className="flex w-full items-center justify-center px-6 py-16 sm:py-24"
      ref={sectionRef}
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <Badge variant="secondary" className="mb-4 tracking-widest uppercase">
            How It Works
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Live in four steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cellae is built for momentum. Go from sign-up to a shareable profile
            without touching a single line of code.
          </p>
        </div>

        <div>
          <ol className="flex flex-col">
            {steps.map(({ icon: Icon, title, copy }, index) => {
              const isLast = index === steps.length - 1
              return (
                <li key={title} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                      <Icon
                        className="size-4 text-foreground"
                        aria-hidden="true"
                      />
                    </span>
                    {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
                  </div>

                  <div className={isLast ? "pb-0" : "pb-10"}>
                    <h3 className="font-heading text-base font-semibold">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {copy}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
