# Fiesta Bob Esponja 🧽

App para asignar personajes a invitados y que cada uno busque el suyo.

## Deploy en Vercel

### 1. Instala dependencias y sube a GitHub

```bash
cd spongebob-party
npm install
```

Crea un repositorio en GitHub y sube el proyecto:
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/spongebob-party.git
git push -u origin main
```

### 2. Crea el proyecto en Vercel

- Ve a vercel.com → "Add New Project"
- Importa tu repositorio de GitHub
- Vercel detectará Next.js automáticamente

### 3. Crea la base de datos KV

En el dashboard de Vercel:
- Ve a tu proyecto → pestaña **Storage**
- Crea una **KV Database**
- Vercel agrega las variables de entorno automáticamente

### 4. Agrega la contraseña de admin

En Vercel → tu proyecto → **Settings → Environment Variables**:
```
ADMIN_PASSWORD = la_contraseña_que_elijas
```

### 5. Redeploy

En Vercel → **Deployments** → click en los tres puntos → **Redeploy**

---

## URLs

- **Invitados**: `https://tu-app.vercel.app`
- **Admin**: `https://tu-app.vercel.app/admin`

## Desarrollo local

```bash
cp .env.example .env.local
# Llena las variables KV desde Vercel Dashboard → Storage → tu DB → .env.local tab
npm run dev
```
