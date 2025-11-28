---
# 🎲 Admin Panel - Juegos de Mesa

Este proyecto es un **panel de administración de juegos de mesa** desarrollado como práctica y para demostrar la integración de un backend Java realizado durante el curso.
---

## 📝 Descripción general

El sistema permite gestionar productos (juegos de mesa) y categorías, visualizar estadísticas y realizar operaciones CRUD desde una interfaz moderna y responsiva.  
El frontend está construido en **Next.js** y se comunica con un backend desarrollado en **Java (Spring Boot)**.

---

## 🚀 Características principales

- Gestión de productos y categorías
- Dashboard con estadísticas (totales y promedios)
- Búsqueda y filtrado en tiempo real
- Manejo centralizado de errores y notificaciones
- UI moderna y adaptable a dispositivos móviles
- Integración completa con backend Java vía API REST

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Java, Spring Boot (repositorio aparte)
- **Notificaciones:** Sonner
- **Consumo de API:** Axios, React Query

---

## ⚙️ Requisitos previos

- Node.js 18+ (solo si quieres correr el frontend localmente)
- Acceso al backend Java (Spring Boot) de este proyecto

---

## 🟢 Opciones para usar el aplicativo

### 1. Usar el frontend ya desplegado en Vercel

Puedes acceder directamente al panel desde:

👉 [https://boardgames-admin-panel-fe.vercel.app/](https://boardgames-admin-panel-fe.vercel.app/)

**Importante:**  
Debes tener el backend Java corriendo localmente para que la aplicación funcione correctamente.

#### ¿Cómo correr el backend?

1. Clona el backend desde el siguiente repositorio:

   ```bash
   git clone https://github.com/Nataliasoledadnavarro/java-boardgame-admin-panel-be.git
   ```

2. Abre el proyecto en tu IDE favorito (por ejemplo, IntelliJ IDEA o Eclipse).
3. Asegúrate de tener Java 17+ instalado.
4. Ejecuta la aplicación Spring Boot (por ejemplo, con el comando `./mvnw spring-boot:run` o desde el IDE).
5. El backend debería estar corriendo en `http://localhost:8080/api` por defecto.

---

### 2. Correr el frontend localmente

Si prefieres correr el frontend en tu máquina, sigue estos pasos:

#### 1. Clona este repositorio

```bash
git clone https://github.com/Nataliasoledadnavarro/boardgames-admin-panel-fe.git
```

#### 2. Instala las dependencias

```bash
npm install
```

#### 3. Descarga y ejecuta el backend Java

Sigue los mismos pasos indicados arriba para clonar y correr el backend.

#### 4. Configura las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto frontend con el siguiente contenido:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Ajusta la URL si tu backend corre en otro puerto o dominio.

#### 5. Ejecuta el servidor de desarrollo del frontend

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---
Puedes acceder al video demo:

👉 [https://www.veed.io/view/es-ES/fca82af2-0fa5-4d38-b86d-2b4d0c29e88b?panel=share/](https://www.veed.io/view/es-ES/fca82af2-0fa5-4d38-b86d-2b4d0c29e88b?panel=share)

---

## 👩‍💻 Autoría

Proyecto realizado por Natalia Navarro como parte del curso de Java.

---

¡Gracias por visitar este proyecto!
