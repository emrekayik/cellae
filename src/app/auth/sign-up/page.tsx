"use client"

import { signupAction } from "@/app/auth/actions"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { signUpSchema } from "@/lib/validations/auth"

export default function SignUpPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    const rawData = {
      fullName: formData.get("fullName"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      age: formData.get("age"),
      gender: formData.get("gender") || undefined,
    }

    const validation = signUpSchema.safeParse(rawData)
    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }

    startTransition(async () => {
      const result = await signupAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Go to Home
      </Link>

      <Card className="w-full max-w-lg border-border/60 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription>Create your cellae account.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Emre Kayık"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  placeholder="emre"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@domain.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="age"
                  className="flex items-center justify-between text-xs font-medium text-muted-foreground"
                >
                  <span>Age</span>
                  <span className="text-[10px] text-muted-foreground/80">
                    (Min. 18)
                  </span>
                </label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={18}
                  max={120}
                  placeholder="18"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="gender"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                  defaultValue=""
                >
                  <option value="" disabled className="text-muted-foreground">
                    Select (optional)
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Do you already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
