const _NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
]

export default function Footer() {
  return (
    <section className="flex w-full flex-col items-stretch">
      <footer className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col leading-none">
            <span className="text-sm font-syncopate tracking-tight">
              cellae
            </span>
            <span className="text-xs text-muted-foreground">
              Your corner of the internet.
            </span>
          </div>

          <p className="shrink-0 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-syncopate">cellae</span>, Inc.
          </p>
        </div>
      </footer>
    </section>
  )
}
