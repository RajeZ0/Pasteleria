"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { clearAuthSession, getAuthToken } from "@/lib/auth"

export function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const updateStatus = () => {
      setIsAuthenticated(Boolean(getAuthToken()))
    }
    updateStatus()
    window.addEventListener("storage", updateStatus)
    return () => window.removeEventListener("storage", updateStatus)
  }, [])

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalogo" },
    { name: "Pedidos", href: "/pedidos" },
    { name: "Contacto", href: "/contacto" },
  ]

  const handleLogout = () => {
    clearAuthSession()
    setIsAuthenticated(false)
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DULCES%20MOMENTOSSS-CdRR5ru0NwdEFteQ7cgSZv9Hb5FaLU.png"
              alt="Dulces Momentos"
              width={50}
              height={50}
              className="object-contain"
            />
            <span
              className="font-serif text-xl font-semibold text-foreground hidden sm:inline"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Dulces Momentos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/pedido-personalizado">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Hacer Pedido</Button>
            </Link>
            {isAuthenticated ? (
              <Button variant="ghost" onClick={handleLogout}>
                Cerrar sesion
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Iniciar sesion</Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/pedido-personalizado">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                    Hacer Pedido
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Button variant="outline" onClick={handleLogout}>
                    Cerrar sesion
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Iniciar sesion
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
