"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
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

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  )
  const [errorMessage, setErrorMessage] = useState<string>("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMessage("")

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const res = await fetch("https://api.formpaste.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.success !== false) {
        setStatus("ok")
        toast.success(data?.message || "You're subscribed. See you Tuesday!")
        form.reset()
      } else {
        const message =
          data?.message || "Something went wrong. Please try again."
        setStatus("error")
        setErrorMessage(message)
        toast.error(message)
      }
    } catch {
      const message =
        "Network error. Please check your connection and try again."
      setStatus("error")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <section
      className="flex w-full items-center justify-center px-6 py-16 sm:py-24"
      ref={sectionRef}
    >
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-border bg-card px-8 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-sm">
            <Badge variant="secondary" className="tracking-widest uppercase">
              Cellae Letter
            </Badge>
            <h2 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
              Ideas for building a better corner
            </h2>
            <p className="text-sm text-muted-foreground">
              Design tips, featured profiles, and behind-the-scenes notes from
              the Cellae team — landing in your inbox every other Tuesday.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:max-w-md md:min-w-0 md:flex-1">
            {status === "ok" ? (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-background/50 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <span>You&apos;re subscribed!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  See you Tuesday! Check your inbox for updates from Cellae.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 w-fit"
                  onClick={() => setStatus("idle")}
                >
                  Subscribe another email
                </Button>
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                <Input
                  type="hidden"
                  name="access_key"
                  value="fp_ivMNgQ_MdZ6coKEsNPfoxnUG"
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    name="email"
                    required
                    disabled={status === "sending"}
                    placeholder="work@company.com"
                    aria-label="Email address"
                    className="flex-1 border-border bg-background"
                  />
                  <Button
                    type="submit"
                    className="shrink-0"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight data-icon="inline-end" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="newsletter-consent"
                    name="consent"
                    required
                    disabled={status === "sending"}
                  />
                  <label
                    htmlFor="newsletter-consent"
                    className="text-sm font-normal text-muted-foreground select-none"
                  >
                    I agree to receive the{" "}
                    <span className="font-syncopate text-xs">cellae</span>{" "}
                    changelog newsletter.
                  </label>
                </div>
                {status === "error" && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                )}
              </form>
            )}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock aria-hidden="true" className="shrink-0" size={12} />
              Your data stays private. Unsubscribe any time, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
