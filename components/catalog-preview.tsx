import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "@/components/icons"
import Link from "next/link"

export function CatalogPreview() {
  const products = [
    {
      name: "Pastel de Chocolate",
      description: "Delicioso pastel de chocolate con ganache",
      price: "$450",
      image: "/chocolate-ganache-cake.png",
    },
    {
      name: "Pastel de Vainilla",
      description: "Suave pastel de vainilla con crema",
      price: "$400",
      image: "/vanilla-cake.png",
    },
    {
      name: "Pastel Red Velvet",
      description: "Clásico red velvet con queso crema",
      price: "$480",
      image: "/red-velvet-cake.png",
    },
    {
      name: "Pastel de Zanahoria",
      description: "Pastel de zanahoria con nueces",
      price: "$420",
      image: "/delicious-carrot-cake-with-cream-cheese-frosting-a.jpg",
    },
  ]

  return (
    <section id="catalogo" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
            Nuestras Especialidades
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra selección de pasteles artesanales
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <Card
              key={index}
              className="border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Ordenar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/catalogo">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
              Ver Catálogo Completo
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
