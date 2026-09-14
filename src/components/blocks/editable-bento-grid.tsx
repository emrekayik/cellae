"use client"

import React, { useState, useTransition } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Pencil,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Github,
  TrendingUp,
  Share2,
  Sparkles,
  FileText,
  Maximize2,
  Check,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  saveBentoGridLayoutAction,
  addBentoCardAction,
  deleteBentoCardAction,
  type BentoCardRow,
  type CardTypeEnum,
} from "@/app/app/actions/bento"

interface EditableBentoGridProps {
  portfolioId: string
  initialCards: BentoCardRow[]
}

export function getSpanClasses(colSpan = 1, rowSpan = 1) {
  const colClass =
    colSpan === 3
      ? "col-span-1 md:col-span-2 lg:col-span-3"
      : colSpan === 2
        ? "col-span-1 md:col-span-2"
        : "col-span-1"

  const rowClass =
    rowSpan === 3
      ? "row-span-3 min-h-[500px]"
      : rowSpan === 2
        ? "row-span-2 min-h-[340px]"
        : "row-span-1 min-h-[180px]"

  return `${colClass} ${rowClass}`
}

export function EditableBentoGrid({
  portfolioId,
  initialCards,
}: EditableBentoGridProps) {
  const [cards, setCards] = useState<BentoCardRow[]>(
    [...initialCards].sort((a, b) => a.display_order - b.display_order)
  )
  const [isEditing, setIsEditing] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const persistLayout = (updatedCards: BentoCardRow[]) => {
    setSaveStatus("saving")
    startSaving(async () => {
      const payload = updatedCards.map((c, index) => ({
        id: c.id,
        col_span: c.col_span ?? 1,
        row_span: c.row_span ?? 1,
        display_order: index,
      }))

      const res = await saveBentoGridLayoutAction(portfolioId, payload)
      if (res.error) {
        toast.error("Düzen kaydedilemedi: " + res.error)
        setSaveStatus("idle")
      } else {
        setSaveStatus("saved")
        toast.success("Bento grid düzeni kaydedildi")
        setTimeout(() => setSaveStatus("idle"), 2500)
      }
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((c) => c.id === active.id)
      const newIndex = cards.findIndex((c) => c.id === over.id)

      const reordered = arrayMove(cards, oldIndex, newIndex).map(
        (card, index) => ({
          ...card,
          display_order: index,
        })
      )

      setCards(reordered)
      persistLayout(reordered)
    }
  }

  const handleResize = (id: string, newCol: number, newRow: number) => {
    const updated = cards.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          col_span: newCol,
          row_span: newRow,
        }
      }
      return c
    })
    setCards(updated)
    persistLayout(updated)
  }

  const handleAddCard = async (type: CardTypeEnum) => {
    toast.loading("Yeni kart ekleniyor...")
    const res = await addBentoCardAction(portfolioId, type)
    toast.dismiss()

    if (res.error || !res.data) {
      toast.error("Kart eklenemedi: " + res.error)
    } else {
      const updated = [...cards, res.data]
      setCards(updated)
      toast.success("Yeni kart eklendi")
    }
  }

  const handleDeleteCard = async (id: string) => {
    const previous = [...cards]
    const updated = cards.filter((c) => c.id !== id)
    setCards(updated)

    toast.loading("Kart siliniyor...")
    const res = await deleteBentoCardAction(id)
    toast.dismiss()

    if (res.error) {
      setCards(previous)
      toast.error("Kart silinemedi: " + res.error)
    } else {
      toast.success("Kart silindi")
      persistLayout(updated)
    }
  }

  const activeCard = cards.find((c) => c.id === activeId)

  return (
    <div className="space-y-4">
      {/* Üst Yönetim Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2.5 py-1 text-xs gap-1.5 font-medium">
            <Sparkles className="size-3 text-primary" />
            Bento Grid Düzenleyici
          </Badge>

          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              Kaydediliyor...
            </span>
          )}

          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <Check className="size-3" />
              Veritabanına Kaydedildi
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Kart Ekle Hızlı Menü */}
          {isEditing && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => handleAddCard("project_showcase")}
              >
                <Plus className="size-3.5" />
                Proje Kartı
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => handleAddCard("tech_stack")}
              >
                <Plus className="size-3.5" />
                Stack Kartı
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => handleAddCard("metric_stat")}
              >
                <Plus className="size-3.5" />
                Metrik Kartı
              </Button>
            </div>
          )}

          {/* Mod Değiştirme Butonu */}
          <Button
            variant={isEditing ? "default" : "secondary"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Eye className="size-3.5" />
                Önizleme Modu
              </>
            ) : (
              <>
                <Pencil className="size-3.5" />
                Düzenleme Modu
              </>
            )}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            💡 <strong>İpucu:</strong> Kartları tutamaktan (<GripVertical className="inline size-3.5" />) sürükleyip bırakarak yerini değiştirebilir, kart üzerindeki boyut butonlarıyla genişlik ve yüksekliklerini ayarlayabilirsiniz. Düzen anında Supabase veritabanına kaydedilir.
          </span>
        </div>
      )}

      {/* Grid Alanı */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[180px] sm:auto-rows-[190px] gap-4">
            {cards.map((card) => (
              <SortableBentoItem
                key={card.id}
                card={card}
                isEditing={isEditing}
                onResize={(col, row) => handleResize(card.id, col, row)}
                onDelete={() => handleDeleteCard(card.id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard ? (
            <BentoCardView card={activeCard} isOverlay isEditing={false} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

interface SortableBentoItemProps {
  card: BentoCardRow
  isEditing: boolean
  onResize: (col: number, row: number) => void
  onDelete: () => void
}

function SortableBentoItem({
  card,
  isEditing,
  onResize,
  onDelete,
}: SortableBentoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !isEditing })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        getSpanClasses(card.col_span ?? 1, card.row_span ?? 1),
        isDragging && "opacity-40 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl"
      )}
    >
      <BentoCardView
        card={card}
        isEditing={isEditing}
        dragHandleProps={{ ...attributes, ...listeners }}
        onResize={onResize}
        onDelete={onDelete}
      />
    </div>
  )
}

interface BentoCardViewProps {
  card: BentoCardRow
  isEditing: boolean
  isOverlay?: boolean
  dragHandleProps?: Record<string, any>
  onResize?: (col: number, row: number) => void
  onDelete?: () => void
}

function BentoCardView({
  card,
  isEditing,
  isOverlay,
  dragHandleProps,
  onResize,
  onDelete,
}: BentoCardViewProps) {
  const col = card.col_span ?? 1
  const row = card.row_span ?? 1

  // Arka plan stilleri
  const getBgStyle = () => {
    switch (card.background_effect) {
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

  // İkon seçimi
  const getIcon = () => {
    switch (card.card_type) {
      case "project_showcase":
        return <Code2 className="size-5 text-purple-500" />
      case "tech_stack":
        return <Sparkles className="size-5 text-amber-500" />
      case "github_stats":
        return <Github className="size-5 text-foreground" />
      case "metric_stat":
        return <TrendingUp className="size-5 text-emerald-500" />
      case "social_links":
        return <Share2 className="size-5 text-blue-500" />
      default:
        return <FileText className="size-5 text-muted-foreground" />
    }
  }

  return (
    <div
      className={cn(
        "group relative flex size-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 p-5 shadow-sm transition-all duration-200",
        getBgStyle(),
        isOverlay && "scale-105 shadow-xl border-primary ring-2 ring-primary/40",
        !isEditing && "hover:border-primary/40 hover:shadow-md"
      )}
    >
      {/* Düzenleme Kontrol Araçları (Header) */}
      <div className="flex items-start justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/50 bg-background/80 shadow-xs">
            {getIcon()}
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {card.card_type.replace("_", " ")}
            </span>
            <h4 className="text-sm font-semibold tracking-tight text-foreground line-clamp-1">
              {card.title || "Başlıksız Kart"}
            </h4>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/90 p-1 shadow-xs backdrop-blur-md">
            {/* Boyut Seçici Menü */}
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground">
              {[
                { col: 1, row: 1, label: "1x1" },
                { col: 2, row: 1, label: "2x1" },
                { col: 1, row: 2, label: "1x2" },
                { col: 2, row: 2, label: "2x2" },
                { col: 3, row: 1, label: "3x1" },
                { col: 3, row: 2, label: "3x2" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={(e) => {
                    e.stopPropagation()
                    onResize?.(s.col, s.row)
                  }}
                  className={cn(
                    "rounded px-1.5 py-0.5 transition-colors hover:bg-muted",
                    col === s.col && row === s.row
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground"
                  )}
                  title={`${s.label} boyutuna ayarla`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Kartı Sil */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
              title="Kartı sil"
            >
              <Trash2 className="size-3.5" />
            </button>

            {/* Sürükleme Tutamacı */}
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-0.5"
              title="Sıralamak için sürükleyin"
            >
              <GripVertical className="size-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* Kart İçerik Gövdesi */}
      <div className="my-auto py-2 z-10">
        {card.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {card.subtitle}
          </p>
        )}

        {/* Kart tipine özel içerik */}
        {card.card_type === "tech_stack" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
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
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              5+
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Yıllık Üretim & Deneyim
            </span>
          </div>
        )}

        {card.card_type === "github_stats" && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-foreground/5 border border-border/40">
              <Github className="size-5 text-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">500+ Commit</div>
              <div className="text-[11px] text-muted-foreground">Aktif Açık Kaynak</div>
            </div>
          </div>
        )}
      </div>

      {/* Alt Çubuk / CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 z-10">
        <span className="text-[10px] text-muted-foreground">
          Boyut: {col}x{row} Sütun/Satır
        </span>

        {card.cta_url && card.cta_label && (
          <a
            href={card.cta_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            onClick={(e) => isEditing && e.stopPropagation()}
          >
            {card.cta_label}
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>
    </div>
  )
}
