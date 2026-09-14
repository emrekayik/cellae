import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, User, Sparkles } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { getSpanClasses } from "@/lib/bento"
import { cn } from "@/lib/utils"
import type { BentoCardRow } from "@/app/app/actions/bento"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Portfolyo ve bento kartlarını getir
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*, bento_cards(*), profiles:profiles!portfolios_user_id_fkey(*)")
    .eq("slug", slug)
    .single()

  if (!portfolio) {
    notFound()
  }

  const profile = portfolio.profiles
  const cards = ((portfolio.bento_cards as BentoCardRow[]) || []).sort(
    (a, b) => a.display_order - b.display_order
  )

  const getBgStyle = (effect: string | null) => {
    switch (effect) {
      case "gradient-purple":
        return "bg-gradient-to-br from-purple-500/10 via-background to-background"
      case "gradient-blue":
        return "bg-gradient-to-br from-blue-500/10 via-background to-background"
      case "dots":
        return "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-background"
      case "grid":
        return "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-background"
      case "glow":
        return "bg-gradient-to-tr from-amber-500/10 via-background to-background"
      default:
        return "bg-card"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Üst Bar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="font-syncopate text-lg font-bold tracking-tight"
          >
            cellae
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Kendi Bento&apos;nu Oluştur →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
        {/* Profil & Portfolyo Başlığı */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted/30 shadow-inner">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.username || "Profil"}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <User className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {profile?.full_name || portfolio.title}
              </h1>
              {profile?.is_verified && (
                <Badge variant="default" className="text-xs">
                  Onaylı
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {portfolio.description || profile?.bio || `@${profile?.username}`}
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[180px] sm:auto-rows-[190px] gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                getSpanClasses(card.col_span ?? 1, card.row_span ?? 1),
                "group relative flex size-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 p-5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md",
                getBgStyle(card.background_effect)
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {card.card_type.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-1">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>

              {card.card_type === "tech_stack" && (
                <div className="flex flex-wrap gap-1.5 my-auto py-2">
                  {["Next.js 16", "React 19", "TypeScript", "TailwindCSS", "Supabase"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}

              {card.card_type === "metric_stat" && (
                <div className="flex items-baseline gap-2 my-auto py-2">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    5+
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Yıllık Deneyim
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" />
                  Bento Card
                </span>

                {card.cta_url && card.cta_label && (
                  <a
                    href={card.cta_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    {card.cta_label}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
