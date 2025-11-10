"use client"

import { InteractiveBackground } from "@/components/interactive-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCartIcon } from "@/components/icons"
import Link from "next/link"

const productos = [
  {
    id: 1,
    nombre: "Pastel de Chocolate Premium",
    descripcion: "Delicioso pastel de chocolate con ganache y decoración elegante",
    precio: "$450",
    imagen: "/chocolate-ganache-cake.png",
  },
  {
    id: 2,
    nombre: "Pastel de Vainilla Clásico",
    descripcion: "Suave pastel de vainilla con crema de mantequilla",
    precio: "$380",
    imagen: "/vanilla-cake.png",
  },
  {
    id: 3,
    nombre: "Pastel Red Velvet",
    descripcion: "Pastel aterciopelado con frosting de queso crema",
    precio: "$420",
    imagen: "/red-velvet-cake.png",
  },
  {
    id: 4,
    nombre: "Pastel de Zanahoria",
    descripcion: "Pastel húmedo de zanahoria con nueces y especias",
    precio: "$400",
    imagen: "/moist-carrot-cake-with-cream-cheese-frosting-walnu.jpg",
  },
  {
    id: 5,
    nombre: "Pastel de Tres Leches",
    descripcion: "Tradicional pastel empapado en tres tipos de leche",
    precio: "$350",
    imagen: "/traditional-tres-leches-cake-soaked-in-three-milks.jpg",
  },
  {
    id: 6,
    nombre: "Pastel de Fresas",
    descripcion: "Pastel ligero con fresas frescas y crema chantilly",
    precio: "$480",
    imagen: "/light-strawberry-cake-with-fresh-strawberries-and-.jpg",
  },
  {
    id: 7,
    nombre: "Concha",
    descripcion: "Pan dulce tradicional con costra de azúcar",
    precio: "$15",
    imagen: "/concha.jpg",
  },
  {
    id: 8,
    nombre: "Cuerno",
    descripcion: "Pan hojaldrado en forma de cuerno",
    precio: "$18",
    imagen: "/cuerno.jpg",
  },
  {
    id: 9,
    nombre: "Pan de Muerto",
    descripcion: "Pan tradicional de Día de Muertos con aroma de azahar",
    precio: "$45",
    imagen: "/pan-de-muerto.jpg",
  },
  {
    id: 10,
    nombre: "Rosca de Reyes",
    descripcion: "Rosca tradicional de Reyes con frutas cristalizadas",
    precio: "$280",
    imagen: "/rosca-de-reyes.jpg",
  },
  {
    id: 11,
    nombre: "Oreja",
    descripcion: "Pan hojaldrado crujiente con azúcar",
    precio: "$16",
    imagen: "/oreja.jpg",
  },
  {
    id: 12,
    nombre: "Cocol",
    descripcion: "Pan tradicional con piloncillo y anís",
    precio: "$12",
    imagen: "/cocol.jpg",
  },
  {
    id: 13,
    nombre: "Bisquet",
    descripcion: "Pan suave y esponjoso ideal para el desayuno",
    precio: "$10",
    imagen: "/bisquet.jpg",
  },
  {
    id: 14,
    nombre: "Galleta de Gragea",
    descripcion: "Galleta decorada con grageas de colores",
    precio: "$14",
    imagen: "/galleta-gragea.jpg",
  },
  {
    id: 15,
    nombre: "Campechana",
    descripcion: "Pan dulce con costra de chocolate y vainilla",
    precio: "$16",
    imagen: "/campechana.jpg",
  },
  {
    id: 16,
    nombre: "Chilindrina",
    descripcion: "Pan dulce crujiente con azúcar",
    precio: "$13",
    imagen: "/chilindrina.jpg",
  },
  {
    id: 17,
    nombre: "Bigote",
    descripcion: "Pan dulce en forma de bigote con azúcar",
    precio: "$15",
    imagen: "/bigote.jpg",
  },
  {
    id: 18,
    nombre: "Mantecada",
    descripcion: "Panqué individual esponjoso y dulce",
    precio: "$12",
    imagen: "/mantecada.jpg",
  },
  {
    id: 19,
    nombre: "Dona",
    descripcion: "Dona glaseada suave y esponjosa",
    precio: "$18",
    imagen: "/dona.jpg",
  },
  {
    id: 20,
    nombre: "Piedra",
    descripcion: "Pan dulce redondo con costra crujiente",
    precio: "$14",
    imagen: "/piedra.jpg",
  },
  {
    id: 21,
    nombre: "Rebanada",
    descripcion: "Pan dulce rectangular con costra de azúcar",
    precio: "$16",
    imagen: "/rebanada.jpg",
  },
  {
    id: 22,
    nombre: "Moño",
    descripcion: "Pan dulce en forma de moño con azúcar",
    precio: "$15",
    imagen: "/mono.jpg",
  },
  {
    id: 23,
    nombre: "Novia",
    descripcion: "Pan dulce alargado con costra blanca",
    precio: "$17",
    imagen: "/novia.jpg",
  },
  {
    id: 24,
    nombre: "Churro",
    descripcion: "Churro crujiente con azúcar y canela",
    precio: "$20",
    imagen: "/churro.jpg",
  },
  {
    id: 25,
    nombre: "Empanada",
    descripcion: "Empanada de frutas o cajeta",
    precio: "$22",
    imagen: "/empanada.jpg",
  },
  {
    id: 26,
    nombre: "Pan de Nata",
    descripcion: "Pan suave con nata fresca",
    precio: "$19",
    imagen: "/pan-de-nata.jpg",
  },
]

export default function CatalogoPage() {
  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1
              className="text-5xl sm:text-6xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Nuestro Catálogo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección de pasteles artesanales y pan dulce mexicano tradicional, cada uno elaborado
              con ingredientes premium y mucho amor
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <Card key={producto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={producto.imagen || "/placeholder.svg"}
                    alt={producto.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
                    {producto.nombre}
                  </CardTitle>
                  <CardDescription>{producto.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                    {producto.precio}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/pedido-personalizado" className="w-full">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <ShoppingCartIcon className="mr-2 h-4 w-4" />
                      Ordenar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <p className="text-muted-foreground mb-4">¿No encuentras lo que buscas?</p>
            <Link href="/pedido-personalizado">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Solicita un Pedido Personalizado
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
