# Proyecto Pastelería

Aplicación full-stack para gestionar pedidos de una pastelería: frontend en Next.js 15 (app router) y backend en Django REST Framework con PostgreSQL. El proyecto incluye integración de notificaciones en tiempo real mediante **ntfy.sh**.

---

## Requisitos

- Docker Desktop o `docker` + `docker compose`
- Node 20+/npm (opcional, para correr frontend sin contenedores)
- Python 3.13+ (opcional, para correr backend sin contenedores)

---

## Configuración inicial

1. Clonar el repositorio y ubicarse en la raíz (`PROYECTO PASTELERIA`).
2. Copiar variables de entorno:

   ```bash
   cp backend/.env.example backend/.env
   cp .env.local.example .env.local
   ```

3. Editar las variables relevantes:

   - `backend/.env`
     - `DATABASE_URL` (si usarás otro Postgres)
     - `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD`
      - `NTFY_TOPIC`, `NTFY_TOKEN` según tu suscripción ntfy
   - `.env.local`
     - `NEXT_PUBLIC_API_URL=http://localhost:8000/api` (para desarrollo local)

---

## Levantar con Docker

```bash
docker compose up -d --build
```

Servicios expuestos:

- Frontend: http://localhost:8080
- Backend (API/Admin): http://localhost:8000
- Postgres: puerto 5432 (credenciales definidas en `docker-compose.yml`)

Para ver logs:

- Backend: `docker compose logs backend -f`
- Frontend: `docker compose logs frontend -f`
- Base de datos: `docker compose logs db -f`

---

## Paso a paso para ejecutar en localhost

1. Abre una terminal en la carpeta `PROYECTO PASTELERIA` y confirma que Docker Desktop este corriendo.
2. Verifica que existen `backend/.env` y `.env.local`; si no, copia los `.example` y ajusta credenciales o URLs segun tus necesidades.
3. Ejecuta `docker compose up -d --build` para construir las imagenes y arrancar Postgres, Django y Next.js.
4. Comprueba el estado con `docker compose ps` o revisa los logs en vivo (`docker compose logs backend -f`) hasta ver `Starting development server at http://0.0.0.0:8000/`.
5. Abre http://localhost:8080 para el frontend y http://localhost:8000 (mas `/admin/`) para el backend administrativo.
6. Cuando termines, cierra los servicios con `docker compose down`; usa `docker compose down -v` solo si quieres borrar los datos de Postgres.

### Donde abro pgAdmin

1. Instala PgAdmin 4 si aun no lo tienes y abre la aplicacion (menu Inicio en Windows o launcher equivalente).
2. Crea una conexion con **Add New Server** > pestana **Connection** y completa:
   - Host: `localhost`
   - Port: `5432`
   - Maintenance DB: `pasteleria`
   - Username: `pasteleria`
   - Password: `pasteleria`
3. Guarda y expande `Servers > pasteleria > Databases > pasteleria > Schemas` para explorar tablas.
4. Si cambiaste las credenciales en `docker-compose.yml` o `backend/.env`, usa esos valores al crear la conexion.

---

## Usuarios por defecto

El contenedor del backend crea automáticamente un superusuario al iniciar después de las migraciones, usando las variables `DJANGO_SUPERUSER_*` del archivo `backend/.env` (por defecto `admin@example.com` / `Admin123!`). Cambia esos valores antes de ejecutar `docker compose up` si necesitas credenciales distintas.

| Rol          | Usuario / Email              | Contraseña    | Notas                        |
|--------------|------------------------------|---------------|------------------------------|
| Superusuario | `admin` (`admin@example.com`) | `Admin123!`   | Accede al panel `/admin/`    |
| Cliente demo | `cliente2@example.com`       | `Cliente123!` | Puede crear pedidos desde la web |

Puedes crear más usuarios desde `/admin/`, mediante `python manage.py createsuperuser` o usando los endpoints de autenticación (`/api/auth/register/`, `/api/auth/login/`).

---

## Datos iniciales

- Se cargan 30 productos (pasteles y pan dulce) en la tabla `api_product`.
- Para verificar: `http://localhost:8000/api/products/` (GET) o desde el admin.

Si necesitas regenerarlos:

```bash
docker compose exec backend python manage.py shell
```

Ejecuta el script en `README.md` (secciones anteriores) o crea los tuyos manualmente.

---

## Notificaciones (ntfy.sh)

1. Instala la app ntfy en el dispositivo móvil y suscríbete a tu tópico: `https://ntfy.sh/<tu-topic>`.
2. Asegúrate de definir el mismo `NTFY_TOPIC` en `backend/.env`.
3. Reinicia el backend (`docker compose up -d backend`).

Cada vez que se crea un pedido (`POST /api/orders/`) o se cambia su estado (`/api/orders/{id}/set_status/`), se envía un mensaje al tópico configurado.

---

## Flujo principal

1. Navegar a http://localhost:8080 e iniciar sesión (o registrarse).
2. Crear un pedido desde “Pedido personalizado”.
3. Consultar “Mis pedidos” para ver el historial.
4. (Opcional) Cambiar estado de un pedido desde `/admin/` o la API para disparar otra notificación.

---

## API útil (backend)

| Método | Endpoint                       | Descripción                       | Autenticación |
|--------|--------------------------------|-----------------------------------|---------------|
| POST   | `/api/auth/register/`          | Registrar cliente                 | No            |
| POST   | `/api/auth/login/`             | Obtener token/token de sesión     | No            |
| GET    | `/api/products/`               | Listar productos                  | No            |
| POST   | `/api/orders/`                 | Crear pedido                      | Token         |
| GET    | `/api/orders/`                 | Listar pedidos del usuario        | Token         |
| POST   | `/api/orders/{id}/set_status/` | Cambiar estado (admin)            | Token (admin) |
| GET    | `/api/reports/overview/`       | Resumen de ventas (admin)         | Token (admin) |

En peticiones autenticadas agrega el header:

```
Authorization: Token <token_obtenido_en_login>
```

---

## Desarrollo local sin Docker (opcional)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
pnpm install
pnpm dev -p 8080
```

---

## Mantenimiento

- Crear backup de la base:

  ```bash
  docker compose exec db pg_dump -U pasteleria pasteleria > backup.sql
  ```

- Reconstruir imágenes:

  ```bash
  docker compose build --no-cache
  docker compose up -d
  ```

- Limpiar contenedores/volúmenes:

  ```bash
  docker compose down -v
  ```

---

