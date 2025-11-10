"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Cake } from "lucide-react"
import { InteractiveBackground } from "@/components/interactive-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchProducts, createOrder, type Product } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"

export default function PedidoPersonalizadoPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [decoracion, setDecoracion] = useState("")
  const [alergias, setAlergias] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [tamano, setTamano] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string>("")

  const [productos, setProductos] = useState<Product[]>([])
  const [isLoadingProductos, setIsLoadingProductos] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((items) => {
        if (!isMounted) return
        setProductos(items)
        if (items.length > 0) {
          setSelectedProductId(String(items[0].id))
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("No se pudieron cargar los productos. Intenta nuevamente.")
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProductos(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  const productoSeleccionado = useMemo(
    () => productos.find((producto) => String(producto.id) === selectedProductId),
    [productos, selectedProductId],
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedProductId) {
      setError("Selecciona un producto para continuar.")
      return
    }

    if (!tamano) {
      setError("Selecciona un tamano para tu pedido.")
      return
    }

    if (!date) {
      setError("Selecciona la fecha de entrega.")
      return
    }

    const token = getAuthToken()
    if (!token) {
      setError("Tu sesion expiro. Inicia sesion nuevamente.")
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const resumen = [
        `Nombre: ${nombre}`,
        `Telefono: ${telefono}`,
        `Correo: ${correo}`,
        `Tamano: ${tamano || "Sin especificar"}`,
        `Alergias: ${alergias || "Ninguna"}`,
        `Comentarios: ${comentarios || "Sin comentarios"}`,
      ].join(" | ")

      await createOrder(token, {
        delivery_date: date ? format(date, "yyyy-MM-dd") : null,
        notes: resumen,
        items: [
          {
            product: Number(selectedProductId),
            quantity: 1,
            personalization: decoracion || undefined,
          },
        ],
      })

      setIsSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo enviar el pedido."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="relative min-h-screen">
        <InteractiveBackground />
        <Navbar />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Cake className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                    Pedido recibido
                  </h2>
                  <p className="text-muted-foreground">
                    Registramos tu pedido personalizado. Te enviaremos una notificacion cuando sea procesado.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Volver al inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
              Pedido personalizado
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crea el pastel de tus suenos. Completa el formulario con todos los detalles y nosotros lo haremos realidad.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Detalles del pedido
              </CardTitle>
              <CardDescription>Cuentanos como quieres tu pastel y nos encargaremos del resto.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Informacion de contacto</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Juan Perez"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Telefono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="+52 722 123 4567"
                        value={telefono}
                        onChange={(event) => setTelefono(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo electronico *</Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="juan@email.com"
                      value={correo}
                      onChange={(event) => setCorreo(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Detalles del pastel</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sabor">Sabor / producto *</Label>
                      <Select
                        value={selectedProductId}
                        onValueChange={setSelectedProductId}
                        disabled={isLoadingProductos || productos.length === 0}
                      >
                        <SelectTrigger id="sabor">
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productos.map((producto) => (
                            <SelectItem key={producto.id} value={String(producto.id)}>
                              {producto.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isLoadingProductos && productos.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No hay productos disponibles. Crea productos desde el panel de administracion.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tamano">Tamano *</Label>
                      <Select value={tamano} onValueChange={setTamano} required>
                        <SelectTrigger id="tamano">
                          <SelectValue placeholder="Selecciona un tamano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pequeno">Pequeno (8-10 personas)</SelectItem>
                          <SelectItem value="mediano">Mediano (12-15 personas)</SelectItem>
                          <SelectItem value="grande">Grande (20-25 personas)</SelectItem>
                          <SelectItem value="extra-grande">Extra grande (30+ personas)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de entrega *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(selectedDate) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return selectedDate < today
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decoracion">Decoracion y detalles especiales</Label>
                    <Textarea
                      id="decoracion"
                      placeholder="Describe colores, tema, mensaje, flores, etc."
                      rows={4}
                      className="resize-none"
                      value={decoracion}
                      onChange={(event) => setDecoracion(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alergias">Alergias o restricciones alimentarias</Label>
                    <Input
                      id="alergias"
                      placeholder="Sin gluten, sin lacteos, sin nueces..."
                      value={alergias}
                      onChange={(event) => setAlergias(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios adicionales</Label>
                    <Textarea
                      id="comentarios"
                      placeholder="Cualquier otra informacion que debamos saber..."
                      rows={3}
                      className="resize-none"
                      value={comentarios}
                      onChange={(event) => setComentarios(event.target.value)}
                    />
                  </div>

                  {productoSeleccionado && (
                    <p className="text-sm text-muted-foreground">
                      Precio estimado: ${productoSeleccionado.price}
                    </p>
                  )}
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
                  disabled={isSubmitting || isLoadingProductos}
                >
                  {isSubmitting ? "Enviando pedido..." : "Enviar pedido personalizado"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Campos obligatorios. Nos pondremos en contacto contigo en 24 horas para confirmar tu pedido y
                  proporcionarte un presupuesto.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
