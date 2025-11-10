type ApiOptions = {
  token?: string | null
  method?: string
  body?: unknown
}

type AuthPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  user: {
    id: number
    email: string
    username: string
    first_name?: string
    last_name?: string
    role?: string
  }
}

export type Product = {
  id: number
  name: string
  description: string
  price: string
  image: string
}

export type CreateOrderItem = {
  product: number
  quantity: number
  personalization?: string
}

export type CreateOrderPayload = {
  notes?: string
  delivery_date?: string | null
  items: CreateOrderItem[]
}

export type OrderItem = {
  id: number
  quantity: number
  personalization?: string
  subtotal: string
  product: number
  product_detail?: Product
}

export type Order = {
  id: number
  status: string
  order_date: string
  delivery_date: string | null
  notes?: string
  total: string
  items: OrderItem[]
}

function resolveApiBaseUrl() {
  const envBase = process.env.NEXT_PUBLIC_API_URL

  if (typeof window === "undefined") {
    return (envBase || "http://backend:8000/api").replace(/\/$/, "")
  }

  if (!envBase) {
    return `${window.location.origin.replace(/\/$/, "")}/api`
  }

  try {
    const url = new URL(envBase, window.location.origin)
    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname)) {
      url.hostname = window.location.hostname
    }
    return url.toString().replace(/\/$/, "")
  } catch {
    const base = envBase.startsWith("/") ? envBase : `/${envBase}`
    return `${window.location.origin.replace(/\/$/, "")}${base}`.replace(/\/$/, "")
  }
}

const API_BASE_URL = resolveApiBaseUrl()

async function apiFetch<T>(path: string, { token, method = "GET", body }: ApiOptions = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Token ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = "Error al comunicarse con el servidor."
    try {
      const data = await response.json()
      if (typeof data === "string") {
        message = data
      } else if (data?.detail) {
        message = data.detail
      } else if (typeof data === "object") {
        message = Object.values(data).flat().join(" ")
      }
    } catch {
      // Ignore JSON parsing errors and keep default message
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export function login(payload: AuthPayload) {
  return apiFetch<AuthResponse>("/auth/login/", { method: "POST", body: payload })
}

export function register(payload: AuthPayload & { username: string; confirm_password: string; first_name?: string; last_name?: string }) {
  return apiFetch<AuthResponse>("/auth/register/", { method: "POST", body: payload })
}

export function fetchProducts() {
  return apiFetch<Product[]>("/products/")
}

export function createOrder(token: string, payload: CreateOrderPayload) {
  return apiFetch("/orders/", { method: "POST", body: payload, token })
}

export function fetchOrders(token: string) {
  return apiFetch<Order[]>("/orders/", { token })
}
