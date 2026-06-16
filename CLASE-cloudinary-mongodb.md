# Clase: Subir imágenes a Cloudinary y guardarlas en MongoDB

## ¿Qué vamos a hacer?

Vamos a construir un flujo completo: el usuario selecciona una imagen y llena dos campos de texto, eso se envía al backend, el backend sube la imagen a Cloudinary, obtiene el link público y guarda todo en MongoDB.

```
[Formulario React]
      ↓ fetch (FormData)
[Servicio / api.ts]
      ↓ POST /api/productos
[Route Handler Next.js — app/api/productos/route.ts]
      ↓ sube imagen
[Cloudinary]
      ↓ retorna URL
[MongoDB]
      ↓ guarda { nombre, descripcion, imagenUrl }
[Respuesta al frontend]
```

---

## 1. Dependencias

En Next.js **no necesitas** Express, multer ni cors. Next.js maneja todo eso de forma nativa.

```bash
npm install mongoose cloudinary
```

> Next.js ya incluye soporte para `FormData` y `Request` del Web API estándar. No necesitas multer.

---

## 2. Variables de entorno

Agrega al archivo `.env.local` en la raíz del proyecto:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
MONGODB_URI=mongodb://localhost:27017/mi-base-de-datos
```

Para obtener las credenciales de Cloudinary:
1. Entra a [cloudinary.com](https://cloudinary.com) y crea una cuenta gratis.
2. En el Dashboard encontrarás el `Cloud Name`, `API Key` y `API Secret`.

---

## 3. Configurar Cloudinary

Crea el archivo `src/lib/cloudinary.ts`:

```ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const sanitizedName = fileName.trim().replace(/\s+/g, '-');
  const nameWithoutExt = sanitizedName.replace(/\.[^/.]+$/, '');

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          folder: 'productos',
          public_id: `${Date.now()}-${nameWithoutExt}`,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload failed'));
        }
      )
      .end(buffer);
  });
}

export default cloudinary;
```

---

## 4. Modelo de MongoDB

Crea el archivo `src/database/models/Producto.ts`:

```ts
import mongoose, { Connection } from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: '' },
  imagenUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export function getProductoModel(conn: Connection) {
  return conn.models.Producto || conn.model('Producto', productoSchema);
}
```

El campo `imagenUrl` guardará el link que nos devuelve Cloudinary.

---

## 5. La ruta del backend (POST)

Crea el archivo `src/app/api/productos/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getProductoModel } from '@/database/models/Producto';

// Conexión simple para este ejemplo
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
  return mongoose.connection;
}

export async function POST(request: NextRequest) {
  try {
    // Next.js parsea el FormData de forma nativa — no necesitas multer
    const formData = await request.formData();

    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const imagen = formData.get('imagen') as File | null;

    if (!imagen) {
      return NextResponse.json(
        { error: 'No se recibió ninguna imagen' },
        { status: 400 }
      );
    }

    // Convertir el File a Buffer para subirlo a Cloudinary
    const arrayBuffer = await imagen.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir imagen a Cloudinary y obtener la URL pública
    const imagenUrl = await uploadToCloudinary(buffer, imagen.name);

    // Guardar en MongoDB con la URL obtenida
    const conn = await connectDB();
    const Producto = getProductoModel(conn);
    const nuevo = await Producto.create({ nombre, descripcion, imagenUrl });

    return NextResponse.json(
      { mensaje: 'Imagen guardada', producto: nuevo },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Productos API]', error);
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
```

### ¿Qué hace cada parte?

| Parte | ¿Qué hace? |
|---|---|
| `request.formData()` | Parsea el FormData de forma nativa — reemplaza a multer |
| `formData.get('imagen') as File` | Obtiene el archivo enviado desde el frontend |
| `imagen.arrayBuffer()` | Convierte el File a ArrayBuffer para poder subirlo |
| `Buffer.from(arrayBuffer)` | Convierte el ArrayBuffer a Buffer que acepta Cloudinary |
| `uploadToCloudinary(buffer, imagen.name)` | Sube el Buffer a Cloudinary y retorna la `secure_url` |
| `Producto.create(...)` | Guarda el documento en MongoDB |

---

## 6. Servicio del frontend

Crea el archivo `src/services/productosService.ts`:

```ts
export async function crearProducto(
  nombre: string,
  descripcion: string,
  imagen: File
) {
  // FormData es necesario para enviar archivos
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('descripcion', descripcion);
  formData.append('imagen', imagen); // imagen es el File del input

  // En Next.js llamamos a la ruta interna — sin URL absoluta ni CORS
  const response = await fetch('/api/productos', {
    method: 'POST',
    body: formData,
    // No pongas Content-Type — el browser lo agrega solo con el boundary correcto
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al guardar');
  }

  return response.json();
}
```

> **Importante:** no pongas `Content-Type: multipart/form-data` manualmente cuando usas `fetch` con `FormData`. El browser lo agrega solo e incluye el `boundary` necesario. Si lo pones a mano, la petición falla.

---

## 7. Componente del frontend (React)

Crea el archivo `src/components/FormularioProducto.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { crearProducto } from '@/services/productosService';

export default function FormularioProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imagen) {
      setMensaje('Selecciona una imagen');
      return;
    }

    try {
      const resultado = await crearProducto(nombre, descripcion, imagen);
      setMensaje(resultado.mensaje); // "Imagen guardada"
    } catch (error) {
      setMensaje('Error al guardar');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Subir Producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {/* El input file guarda el archivo en e.target.files[0] */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
      />

      <button type="submit">Guardar</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
```

> **`'use client'`** es obligatorio en Next.js App Router para cualquier componente que use `useState`, `useEffect` o eventos del DOM.

---

## 8. Estructura final de archivos

```
src/
├── app/
│   └── api/
│       └── productos/
│           └── route.ts        ← POST handler (reemplaza a Express + routes/)
├── database/
│   └── models/
│       └── Producto.ts         ← esquema de MongoDB
├── lib/
│   └── cloudinary.ts           ← configuración y función de subida
├── services/
│   └── productosService.ts     ← fetch al API interno
└── components/
    └── FormularioProducto.tsx  ← formulario con 'use client'

.env.local                      ← credenciales (nunca subir a Git)
```

---

## 9. Flujo paso a paso resumido

1. El usuario llena el formulario y selecciona una imagen.
2. Al hacer submit, el componente llama a `crearProducto(nombre, descripcion, imagen)`.
3. El servicio arma un `FormData` y hace `fetch('/api/productos', { method: 'POST', body: formData })`.
4. Next.js rutea la petición a `src/app/api/productos/route.ts`.
5. El handler llama a `request.formData()` y obtiene el `File` — sin multer.
6. Convierte el `File` a `Buffer` con `arrayBuffer()` + `Buffer.from()`.
7. `uploadToCloudinary` sube el buffer a Cloudinary y retorna la `secure_url`.
8. Con esa URL se crea el documento en MongoDB con `Producto.create(...)`.
9. El handler responde `{ mensaje: 'Imagen guardada', producto: {...} }`.
10. El componente muestra el mensaje al usuario.

---

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `imagen` es `null` en el handler | El campo del FormData no se llama igual en frontend y backend | Verificar que `formData.append('imagen', ...)` y `formData.get('imagen')` usan el mismo nombre |
| `Invalid API credentials` | Las variables de entorno están mal | Revisar `.env.local` — en Next.js las vars del servidor van en `.env.local`, no en `.env` |
| `Content-Type` incorrecto | Se puso `Content-Type: multipart/form-data` manualmente | Quitarlo — el browser lo pone solo con el `boundary` correcto |
| Error de conexión a MongoDB | `MONGODB_URI` no definida o mongoose no conectado | Verificar `.env.local` y que se llama `connectDB()` antes de usar el modelo |
| `'use client'` faltante | Se usó `useState` en un Server Component | Agregar `'use client'` al inicio del componente de formulario |
