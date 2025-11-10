import Link from "next/link"
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DULCES%20MOMENTOSSS-CdRR5ru0NwdEFteQ7cgSZv9Hb5FaLU.png"
                alt="Dulces Momentos"
                width={40}
                height={40}
                className="object-contain brightness-0 invert"
              />
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                Dulces Momentos
              </h3>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Creando momentos dulces desde 2008. Calidad artesanal en cada bocado.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/pedidos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <PhoneIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">+52 722 123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MailIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">info@dulcesmomentos.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">Toluca, Estado de México</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Síguenos</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 Dulces Momentos. Todos los derechos reservados.</p>
          <p className="mt-2">Desarrollado por Edgardo Ortiz, Alan Rios y Roberto del Rio</p>
        </div>
      </div>
    </footer>
  )
}
