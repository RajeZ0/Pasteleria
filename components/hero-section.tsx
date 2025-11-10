"use client"

import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@/components/icons"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Lado izquierdo - Imagen grande estilo Esperanza */}
          <div className="relative h-[500px] lg:h-[700px] order-2 lg:order-1">
            <div className="absolute inset-0 bg-secondary/30 rounded-2xl overflow-hidden">
              <img
                src="/chocolate-ganache-cake.png"
                alt="Pastel artesanal de chocolate"
                className="w-full h-full object-cover"
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Etiqueta flotante */}
            <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur-sm px-6 py-3 rounded-full border border-border">
              <p className="text-sm font-medium text-foreground">Hecho a mano con amor</p>
            </div>
          </div>

          {/* Lado derecho - Texto minimalista estilo Esperanza */}
          <div className="space-y-8 order-1 lg:order-2 animate-fade-in-up">
            <div className="space-y-6">
              <h1
                className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Dulces
                <span className="block text-primary">Momentos</span>
              </h1>

              <div className="w-20 h-1 bg-primary" />

              <p className="text-lg sm:text-xl text-muted-foreground max-w-md leading-relaxed">
                Pasteles artesanales creados con ingredientes premium y recetas tradicionales. Cada creación es única,
                diseñada para hacer de tu celebración un momento inolvidable.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 group w-full sm:w-auto"
                >
                  Ver Catálogo
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pedido-personalizado">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent w-full sm:w-auto"
                >
                  Pedido Personalizado
                </Button>
              </Link>
            </div>

            {/* Estadísticas minimalistas */}
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-md border-t border-border">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                  15+
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Años</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                  500+
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Clientes</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                  100%
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Artesanal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
