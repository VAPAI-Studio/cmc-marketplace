# CMC Marketplace - Setup Guide

> Paso a paso para poner en marcha el proyecto

## ✅ Paso 1: Crear Proyecto Supabase (15 min)

1. **Ir a Supabase**
   - https://supabase.com
   - Login con GitHub
   - Click "New Project"

2. **Configurar proyecto**
   - Name: `cmc-marketplace`
   - Database Password: (genera uno seguro, guárdalo)
   - Region: US East (o más cercano a ti)
   - Plan: **Pro ($25/mo)** — necesario para mejor performance

3. **Esperar a que termine el setup** (~2 minutos)

4. **Guardar credenciales**
   - En Project Settings → API
   - Copiar:
     - `Project URL` → será tu `SUPABASE_URL`
     - `anon public` key → será tu `SUPABASE_ANON_KEY`
     - `service_role` key → será tu `SUPABASE_SERVICE_KEY` (⚠️ secreto!)

---

## ✅ Paso 2: Crear Database Schema (5 min)

1. **Abrir SQL Editor en Supabase**
   - Sidebar izquierdo → "SQL Editor"
   - Click "New Query"

2. **Copiar schema**
   - Abrir `backend/schema.sql` en tu editor
   - Copiar TODO el contenido
   - Pegar en Supabase SQL Editor

3. **Ejecutar**
   - Click "Run" (botón verde)
   - Verificar: debería decir "Success. No rows returned"
   - Si hay errores, avisar (probablemente syntax)

4. **Verificar tablas creadas**
   - Sidebar → "Table Editor"
   - Deberías ver: `users`, `ip_listings`, `ip_materials`, `subscriptions`, `inquiries`, `favorites`, `ip_views`

---

## ✅ Paso 3: Crear Storage Bucket (2 min)

1. **Ir a Storage**
   - Sidebar → "Storage"
   - Click "Create bucket"

2. **Configurar bucket**
   - Name: `ip-materials`
   - Public: **No** (leave unchecked)
   - File size limit: 50 MB
   - Allowed MIME types: deja en blanco (permite todos)
   - Click "Create bucket"

---

## ✅ Paso 4: Obtener Anthropic API Key (5 min)

1. **Ir a Anthropic Console**
   - https://console.anthropic.com
   - Login (create account si no tienes)

2. **Crear API Key**
   - Settings → API Keys
   - Click "Create Key"
   - Name: "cmc-marketplace"
   - Copy key (empieza con `sk-ant-...`)
   - ⚠️ **Guárdala ahora**, no podrás verla después

3. **Agregar billing**
   - Si es cuenta nueva, agregar payment method
   - Sugerencia: agregar $50 de crédito inicial
   - Claude Sonnet 4.5 cuesta ~$0.25 por análisis

---

## ✅ Paso 5: Configurar Backend (5 min)

1. **Navegar al backend**
   ```bash
   cd /Users/yvesfogel/Documents/Projects/cmc-marketplace/backend
   ```

2. **Crear virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

   Esto instala: FastAPI, Supabase client, Anthropic SDK, etc.
   Demora ~2-3 minutos.

4. **Crear archivo .env**
   ```bash
   cp .env.example .env
   ```

5. **Editar .env con tus credenciales**
   - Abrir `.env` en tu editor
   - Reemplazar:
     - `SUPABASE_URL` con tu Project URL
     - `SUPABASE_ANON_KEY` con tu anon key
     - `SUPABASE_SERVICE_KEY` con tu service role key
     - `ANTHROPIC_API_KEY` con tu Anthropic key
     - `SECRET_KEY`: generar uno:
       ```bash
       openssl rand -hex 32
       ```

6. **Guardar y cerrar**

---

## ✅ Paso 6: Probar Backend (2 min)

1. **Correr servidor**
   ```bash
   uvicorn app.main:app --reload
   ```

2. **Verificar que funciona**
   - Abrir navegador: http://localhost:8000
   - Deberías ver: `{"message": "CMC IP Marketplace API", ...}`
   - Probar docs: http://localhost:8000/docs
   - Deberías ver Swagger UI con la API

3. **Si hay errores:**
   - Verificar que el `.env` tiene todas las variables
   - Verificar que las keys de Supabase son correctas
   - Verificar que instalaste todas las dependencias

---

## ⏳ Próximos pasos (después de este setup)

Una vez que llegues hasta aquí y todo funcione, el siguiente paso es:

**Semana 2: Implementar autenticación**
- Integrar Supabase Auth con FastAPI
- Crear endpoints de register/login
- Probar flujo completo

---

## 🆘 Troubleshooting

**Error: "Module not found"**
→ Asegúrate de activar venv: `source venv/bin/activate`

**Error: "Connection refused" al correr backend**
→ Verificar que las Supabase credentials son correctas en `.env`

**Error: "Invalid API key" con Anthropic**
→ Verificar que copiaste la key completa (empieza con `sk-ant-`)

**Backend corre pero /docs no carga**
→ Verificar CORS settings en `.env` (debe incluir `http://localhost:8000`)

---

## 📋 Checklist Final

Antes de continuar a Semana 2, verificar:

- [ ] Supabase proyecto creado y corriendo
- [ ] Database schema ejecutado (7 tablas visibles)
- [ ] Storage bucket "ip-materials" creado
- [ ] Anthropic API key obtenida y con billing
- [ ] Backend dependencies instaladas
- [ ] `.env` configurado con todas las keys
- [ ] Backend corre sin errores en localhost:8000
- [ ] `/health` endpoint responde correctamente
- [ ] Swagger docs visibles en `/docs`

**Una vez completado todo esto, estamos listos para Fase 1 - Semana 2: Auth! 🚀**

---

**Tiempo estimado total: 30-40 minutos**
