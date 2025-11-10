import { CakeIcon, ClockIcon, HeartIcon, SparklesIcon } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: HeartIcon,
      title: "Hecho con Amor",
      description: "Cada pastel es elaborado con dedicación y los mejores ingredientes naturales.",
    },
    {
      icon: CakeIcon,
      title: "Personalización Total",
      description: "Diseños únicos adaptados a tus gustos y necesidades especiales.",
    },
    {
      icon: ClockIcon,
      title: "Entrega Puntual",
      description: "Garantizamos la frescura con entregas programadas a tiempo.",
    },
    {
      icon: SparklesIcon,
      title: "Calidad Premium",
      description: "Ingredientes de primera calidad en cada una de nuestras creaciones.",
    },
  ]

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
            ¿Por Qué Elegirnos?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos dedicamos a crear experiencias dulces memorables con atención al detalle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
