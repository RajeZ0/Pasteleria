"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login as loginRequest, register as registerRequest } from "@/lib/api"
import { saveAuthSession } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistro, setIsRegistro] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isRegistro) {
        const trimmedName = nombre.trim()
        const [firstName = "", ...rest] = trimmedName.split(" ")
        const auth = await registerRequest({
          email,
          password,
          confirm_password: password,
          username: email,
          first_name: firstName,
          last_name: rest.join(" "),
        })
        saveAuthSession(auth.token, auth.user)
      } else {
        const auth = await loginRequest({ email, password })
        saveAuthSession(auth.token, auth.user)
      }
      router.push("/")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar la solicitud."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <img
          src="/chocolate-ganache-cake.png"
          alt="Pastel artesanal"
          className="w-full h-full object-cover mix-blend-multiply"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="flex justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DULCES%20MOMENTOSSS-CdRR5ru0NwdEFteQ7cgSZv9Hb5FaLU.png"
                alt="Dulces Momentos"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center lg:hidden mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DULCES%20MOMENTOSSS-CdRR5ru0NwdEFteQ7cgSZv9Hb5FaLU.png"
                alt="Dulces Momentos"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
              {isRegistro ? "Crear cuenta" : "Bienvenido"}
            </h1>
            <p className="text-muted-foreground">
              {isRegistro ? "Registrate para comenzar a ordenar" : "Ingresa tus credenciales para continuar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistro && (
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  required
                  className="h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading
                ? isRegistro
                  ? "Registrando..."
                  : "Ingresando..."
                : isRegistro
                  ? "Registrarse"
                  : "Iniciar sesion"}
            </Button>
          </form>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsRegistro(!isRegistro)
                setError(null)
              }}
              className="text-primary hover:underline font-medium"
            >
              {isRegistro ? "Ya tienes cuenta? Inicia sesion" : "No tienes cuenta? Registrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
