import { logoutAction } from "@/app/auth/actions"
import {
  ExternalLink,
  Eye,
  Grid,
  LogOut,
  Plus,
  Sparkles,
  User,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EditableBentoGrid } from "@/components/blocks/editable-bento-grid"
import {
  getOrCreateDefaultPortfolioAction,
  type BentoCardRow,
} from "@/app/app/actions/bento"

import { createClient } from "@/lib/supabase/server"

export default async function AppDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Kullanıcının profil bilgilerini getir
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Kullanıcının portfolyolarını ve kartlarını getir
  let { data: portfolios } = await supabase
    .from("portfolios")
    .select("*, bento_cards(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!portfolios || portfolios.length === 0) {
    const defaultPortfolio = await getOrCreateDefaultPortfolioAction()
    if (defaultPortfolio.data) {
      portfolios = [defaultPortfolio.data]
    }
  }

  const activePortfolio =
    portfolios && portfolios.length > 0 ? portfolios[0] : null
  const bentoCards =
    (activePortfolio?.bento_cards as BentoCardRow[]) || []

  const totalViews =
    portfolios?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0
  const totalCards =
    portfolios?.reduce(
      (acc, curr) =>
        acc + (Array.isArray(curr.bento_cards) ? curr.bento_cards.length : 0),
      0
    ) || 0

  const genderLabels: Record<string, string> = {
    male: "Erkek",
    female: "Kadın",
    other: "Diğer",
    prefer_not_to_say: "Belirtilmedi",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Üst Bar / Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-syncopate text-lg font-bold tracking-tight"
            >
              cellae
            </Link>
            <Badge variant="outline" className="text-xs">
              Dashboard
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="gap-2">
                <LogOut className="size-4" />
                <span>Çıkış Yap</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Profil Tanıtım Kartı */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* DiceBear Avatar */}
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

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {profile?.full_name || profile?.username || "Kullanıcı"}
                  </h1>
                  {profile?.is_verified && (
                    <Badge variant="default" className="text-xs">
                      Onaylı
                    </Badge>
                  )}
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                  @{profile?.username}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  {profile?.age && (
                    <Badge variant="secondary" className="text-xs">
                      {profile.age} Yaşında
                    </Badge>
                  )}
                  {profile?.gender && (
                    <Badge variant="outline" className="text-xs">
                      {genderLabels[profile.gender] || profile.gender}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <Button size="sm" className="w-full gap-2 sm:w-auto">
                <Plus className="size-4" />
                Yeni Portfolyo
              </Button>
            </div>
          </div>
        </div>

        {/* Metrikler */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolyolar
              </CardTitle>
              <Grid className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {portfolios?.length || 0}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Aktif ve taslak bento sayfalarınız
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bento Kartları
              </CardTitle>
              <Sparkles className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCards}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tüm sayfalarda ekli toplam kart
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Görüntülenme
              </CardTitle>
              <Eye className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalViews}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Portfolyolarınızın aldığı tekil ziyaretler
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolyo Listesi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Bento Portfolyolarınız
            </h2>
          </div>

          {!portfolios || portfolios.length === 0 ? (
            <Card className="border-dashed py-12 text-center">
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Grid className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    Henüz portfolyo oluşturmadınız
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    İlk bento portfolyonuzu oluşturup projelerinizi sergilemeye
                    başlayın.
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="size-4" />
                  İlk Bento Portfolyonu Oluştur
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className="transition-all hover:border-foreground/30"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          portfolio.is_published ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {portfolio.is_published ? "Yayında" : "Taslak"}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="size-3" />
                        {portfolio.view_count || 0}
                      </span>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1 text-base">
                      {portfolio.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {portfolio.description || "Açıklama belirtilmemiş"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {Array.isArray(portfolio.bento_cards)
                          ? portfolio.bento_cards.length
                          : 0}{" "}
                        kart
                      </span>
                      <Link
                        href={`/${portfolio.slug}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                      >
                        Önizle
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Canlı Düzenlenebilir Bento Grid */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Canlı Bento Grid Editörü
                </h3>
                <p className="text-xs text-muted-foreground">
                  Kartları sürükleyip bırakarak yerini değiştirebilir, boyut düğmeleriyle genişlik ve yüksekliği ayarlayabilirsiniz. Düzen veritabanına anında kaydedilir.
                </p>
              </div>
            </div>

            {activePortfolio && (
              <EditableBentoGrid
                portfolioId={activePortfolio.id}
                initialCards={bentoCards}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
