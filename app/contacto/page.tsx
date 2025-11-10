"use client"

import type React from "react"

import { useState } from "react"
import { InteractiveBackground } from "@/components/interactive-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1500)
  }

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
              Contáctanos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Información de contacto */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Teléfono</CardTitle>
                  <CardDescription>Llámanos de Lun-Sab 9am-7pm</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">+52 722 123 4567</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Escríbenos en cualquier momento</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">contacto@pasteleria.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Ubicación</CardTitle>
                  <CardDescription>Visítanos en nuestra tienda</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">
                    Av. Universidad 123
                    <br />
                    Toluca, Estado de México
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Formulario de contacto */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                  Envíanos un mensaje
                </CardTitle>
                <CardDescription>Completa el formulario y nos pondremos en contacto contigo</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <Input id="nombre" placeholder="Juan Pérez" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="juan@email.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" type="tel" placeholder="+52 722 123 4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto</Label>
                    <Input id="asunto" placeholder="¿En qué podemos ayudarte?" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos más detalles..."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : isSubmitted ? (
                      "¡Mensaje enviado!"
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
