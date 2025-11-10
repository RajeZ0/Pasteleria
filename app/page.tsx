import { InteractiveBackground } from "@/components/interactive-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CatalogPreview } from "@/components/catalog-preview"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CatalogPreview />
      <Footer />
    </main>
  )
}
