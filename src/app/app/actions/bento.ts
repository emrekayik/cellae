'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

export type BentoCardRow = Database['public']['Tables']['bento_cards']['Row']
export type CardTypeEnum = Database['public']['Enums']['card_type']

interface UpdateCardLayoutInput {
  id: string
  col_span: number
  row_span: number
  display_order: number
}

/**
 * Bento Grid kartlarının konum ve boyutlarını toplu olarak günceller
 */
export async function saveBentoGridLayoutAction(
  portfolioId: string,
  cards: UpdateCardLayoutInput[]
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Oturum açmanız gerekiyor.' }
  }

  // Kullanıcının bu portfolyoya erişim hakkı olup olmadığını doğrula
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id, user_id')
    .eq('id', portfolioId)
    .single()

  if (!portfolio || portfolio.user_id !== user.id) {
    return { error: 'Yetkisiz erişim veya portfolyo bulunamadı.' }
  }

  // Kartların pozisyon ve boyutlarını güncelle
  const updatePromises = cards.map((card) =>
    supabase
      .from('bento_cards')
      .update({
        col_span: card.col_span,
        row_span: card.row_span,
        display_order: card.display_order,
      })
      .eq('id', card.id)
      .eq('portfolio_id', portfolioId)
  )

  const results = await Promise.all(updatePromises)
  const failed = results.find((res) => res.error)

  if (failed?.error) {
    return { error: failed.error.message }
  }

  revalidatePath('/app')
  return { success: true }
}

/**
 * Kullanıcının portfolyosu yoksa varsayılan portfolyo ve başlangıç bento kartlarını oluşturur
 */
export async function getOrCreateDefaultPortfolioAction() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Oturum açmanız gerekiyor.' }
  }

  // Mevcut portfolyoları kontrol et
  const { data: existingPortfolios } = await supabase
    .from('portfolios')
    .select('*, bento_cards(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (existingPortfolios && existingPortfolios.length > 0) {
    const active = existingPortfolios[0]
    // Eğer portfolyoda kart yoksa varsayılan kartları ekle
    if (!active.bento_cards || active.bento_cards.length === 0) {
      await seedDefaultCards(supabase, active.id)
      const { data: updated } = await supabase
        .from('portfolios')
        .select('*, bento_cards(*)')
        .eq('id', active.id)
        .single()
      return { data: updated }
    }
    return { data: active }
  }

  // Profil bilgisini çek (slug oluşturmak için)
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('id', user.id)
    .single()

  const baseSlug = profile?.username || `portfolio-${user.id.slice(0, 6)}`

  // Yeni portfolyo oluştur
  const { data: newPortfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .insert({
      user_id: user.id,
      title: `${profile?.full_name || profile?.username || 'Kullanıcı'} Portfolyosu`,
      description: 'Modern bento grid düzeninde hazırlanmış kişisel portfolyo.',
      slug: baseSlug,
      is_published: true,
      theme: 'dark',
    })
    .select()
    .single()

  if (portfolioError || !newPortfolio) {
    return { error: portfolioError?.message || 'Portfolyo oluşturulamadı.' }
  }

  await seedDefaultCards(supabase, newPortfolio.id)

  const { data: fullPortfolio } = await supabase
    .from('portfolios')
    .select('*, bento_cards(*)')
    .eq('id', newPortfolio.id)
    .single()

  revalidatePath('/app')
  return { data: fullPortfolio }
}

async function seedDefaultCards(
  supabase: Awaited<ReturnType<typeof createClient>>,
  portfolioId: string
) {
  const defaultCards = [
    {
      portfolio_id: portfolioId,
      card_type: 'project_showcase' as CardTypeEnum,
      title: 'Öne Çıkan Proje',
      subtitle: 'Modern ve hızlı web uygulamaları geliştirme',
      col_span: 2,
      row_span: 2,
      display_order: 0,
      cta_label: 'Projeyi İncele',
      cta_url: 'https://github.com',
      background_effect: 'gradient-purple',
      content_data: {
        tag: 'Fullstack Next.js',
        metrics: '99.9% Uptime',
      },
    },
    {
      portfolio_id: portfolioId,
      card_type: 'tech_stack' as CardTypeEnum,
      title: 'Yetenekler & Stack',
      subtitle: 'Next.js 16, TypeScript, TailwindCSS, Supabase, PostgreSQL',
      col_span: 1,
      row_span: 2,
      display_order: 1,
      cta_label: 'Teknolojiler',
      cta_url: '#',
      background_effect: 'dots',
      content_data: {
        skills: ['Next.js', 'React 19', 'TypeScript', 'Tailwind', 'Supabase'],
      },
    },
    {
      portfolio_id: portfolioId,
      card_type: 'github_stats' as CardTypeEnum,
      title: 'Açık Kaynak & GitHub',
      subtitle: 'Aktif katkılar, açık kaynak kütüphaneler ve projeler',
      col_span: 1,
      row_span: 1,
      display_order: 2,
      cta_label: 'GitHub Profil',
      cta_url: 'https://github.com',
      background_effect: 'grid',
      content_data: {
        stats: '500+ Katkı',
      },
    },
    {
      portfolio_id: portfolioId,
      card_type: 'metric_stat' as CardTypeEnum,
      title: '5+ Yıl Deneyim',
      subtitle: 'Kullanıcı odaklı dijital ürünler ve modern tasarım',
      col_span: 1,
      row_span: 1,
      display_order: 3,
      cta_label: 'Özgeçmiş',
      cta_url: '#',
      background_effect: 'glow',
      content_data: {
        number: '5+',
        label: 'Yıl Deneyim',
      },
    },
    {
      portfolio_id: portfolioId,
      card_type: 'social_links' as CardTypeEnum,
      title: 'İletişime Geç',
      subtitle: 'Yeni fırsatlar ve işbirlikleri için mesaj gönderebilirsiniz',
      col_span: 1,
      row_span: 1,
      display_order: 4,
      cta_label: 'Bana Ulaş',
      cta_url: 'mailto:contact@example.com',
      background_effect: 'gradient-blue',
      content_data: {
        links: ['Email', 'X / Twitter', 'LinkedIn'],
      },
    },
  ]

  await supabase.from('bento_cards').insert(defaultCards)
}

/**
 * Portfolyoya yeni kart ekler
 */
export async function addBentoCardAction(
  portfolioId: string,
  cardType: CardTypeEnum = 'project_showcase'
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Oturum açmanız gerekiyor.' }
  }

  // Mevcut en yüksek display_order'ı bul
  const { data: cards } = await supabase
    .from('bento_cards')
    .select('display_order')
    .eq('portfolio_id', portfolioId)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = cards && cards.length > 0 ? cards[0].display_order + 1 : 0

  const titles: Record<CardTypeEnum, { title: string; subtitle: string; col: number; row: number }> = {
    project_showcase: { title: 'Yeni Proje Kartı', subtitle: 'Proje detayları ve bağlantılar', col: 2, row: 1 },
    tech_stack: { title: 'Teknoloji Yığını', subtitle: 'Kullandığınız araçlar ve kütüphaneler', col: 1, row: 1 },
    github_stats: { title: 'GitHub İstatistikleri', subtitle: 'Depolar ve katkı geçmişi', col: 1, row: 1 },
    social_links: { title: 'Sosyal Ağlar', subtitle: 'Bağlantı ve profiller', col: 1, row: 1 },
    metric_stat: { title: 'Metrik & Başarı', subtitle: 'Önemli sayılar ve başarılar', col: 1, row: 1 },
    custom_markdown: { title: 'Özel Not & Açıklama', subtitle: 'Serbest metin içeriği', col: 2, row: 1 },
    media_embed: { title: 'Medya & Video', subtitle: 'Görsel veya video gömüntüsü', col: 2, row: 2 },
  }

  const def = titles[cardType] || { title: 'Yeni Kart', subtitle: 'Açıklama', col: 1, row: 1 }

  const { data: newCard, error } = await supabase
    .from('bento_cards')
    .insert({
      portfolio_id: portfolioId,
      card_type: cardType,
      title: def.title,
      subtitle: def.subtitle,
      col_span: def.col,
      row_span: def.row,
      display_order: nextOrder,
      cta_label: 'Detaylar',
      cta_url: '#',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app')
  return { data: newCard }
}

/**
 * Kart siler
 */
export async function deleteBentoCardAction(cardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Oturum açmanız gerekiyor.' }
  }

  const { error } = await supabase
    .from('bento_cards')
    .delete()
    .eq('id', cardId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app')
  return { success: true }
}
