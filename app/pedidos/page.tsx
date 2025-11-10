"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, Package, CheckCircle2, Truck } from "lucide-react"
import { InteractiveBackground } from "@/components/interactive-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchOrders, type Order } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"

const STATUS_META = {
  new: { label: "Nuevo", icon: Clock, color: "bg-yellow-500", progress: 25 },
  in_process: { label: "En proceso", icon: Truck, color: "bg-blue-500", progress: 60 },
  completed: { label: "Completado", icon: CheckCircle2, color: "bg-green-500", progress: 100 },
} as const

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setError("Tu sesion expiro. Inicia sesion nuevamente.")
      setIsLoading(false)
      return
    }

    fetchOrders(token)
      .then((data) => {
        setOrders(data)
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "No se pudieron cargar tus pedidos."
        setError(message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-muted-foreground">Cargando tus pedidos...</p>
          </CardContent>
        </Card>
      )
    }

    if (error) {
      return (
        <Card className="py-12 text-center">
          <CardContent className="space-y-4">
            <p className="text-red-500">{error}</p>
            <Button asChild variant="outline">
              <Link href="/pedido-personalizado">Crear pedido ahora</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (orders.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No tienes pedidos aun</h3>
              <p className="text-muted-foreground">Explora el catalogo y haz tu primer pedido personalizado.</p>
            </div>
            <Button asChild>
              <Link href="/pedido-personalizado">Crear pedido</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    return orders.map((order) => {
      const meta = STATUS_META[order.status as keyof typeof STATUS_META] ?? STATUS_META.new
      const Icon = meta.icon
      const createdAt = format(new Date(order.order_date), "PPPp", { locale: es })
      const delivery = order.delivery_date ? format(new Date(order.delivery_date), "PPP", { locale: es }) : "Por definir"

      return (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                  Pedido #{order.id}
                </CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Creado: {createdAt}</p>
                  <p>Entrega estimada: {delivery}</p>
                </div>
              </div>
              <Badge className={`${meta.color} text-white flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {meta.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${meta.color} rounded-full flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${meta.color} transition-all duration-500`}
                    style={{ width: `${meta.progress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Total: <span className="font-medium text-foreground">${order.total}</span>
              </p>
              {order.notes && <p>Notas: {order.notes}</p>}
              {order.items.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product_detail?.name ?? `Producto ${item.product}`} x{item.quantity}
                      {item.personalization ? ` · ${item.personalization}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardHeader>
        </Card>
      )
    })
  }, [orders, isLoading, error])

  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
              Mis pedidos
            </h1>
            <p className="text-lg text-muted-foreground">Rastrea el estado de tus pedidos en tiempo real.</p>
          </div>

          <div className="space-y-6">{content}</div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
