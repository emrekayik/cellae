import Footer from "@/components/global/footer"
import Header from "@/components/global/header"
import { LenisProvider } from "@/components/provider/lenis-provider"

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LenisProvider>
      <div className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </LenisProvider>
  )
}
