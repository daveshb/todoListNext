
# Historia de Usuario — Task Timer App (React)

## Nombre del proyecto
**Task Timer — ToDo List con temporizador**

---

# Contexto

Se requiere desarrollar una aplicación web tipo ToDo List utilizando **React**, enfocada en la gestión de tareas con seguimiento de tiempo. La aplicación debe permitir crear tareas, iniciar su ejecución, finalizar tareas y visualizar el tiempo invertido en cada una.

La interfaz debe seguir una estructura similar a la mostrada en el mockup proporcionado, usando tarjetas reutilizables para representar cada tarea.

---

# Historia de Usuario Principal

### HU-01 — Gestión de tareas con temporizador

**Como** usuario de la aplicación  
**Quiero** crear, iniciar, finalizar y eliminar tareas  
**Para** poder organizar mis actividades y medir el tiempo invertido en cada una.

---

# Funcionamiento esperado de la aplicación

## Crear tarea
- El usuario escribe el nombre de una tarea en un input.
- Al presionar el botón **Crear**, la tarea se agrega a la lista.
- Las tareas nuevas deben iniciar en estado:
  - `pending`
  - tiempo `0`

---

## Estados de las tareas

Cada tarea puede tener tres estados:

| Estado | Descripción |
|---|---|
| Pending | La tarea aún no inicia |
| In Progress | La tarea está en ejecución |
| Done | La tarea fue finalizada |

---

## Temporizador

### Cuando una tarea está en `In Progress`
- Debe iniciar automáticamente un contador de tiempo.
- El contador debe mostrarse en pantalla en formato:
  - `mm:ss`
- Solo una tarea puede estar activa al mismo tiempo (opcional si el desarrollador desea agregar validación extra).

---

### Cuando una tarea pasa a `Done`
- El contador debe detenerse.
- Debe mostrarse el tiempo total invertido en la tarea.
- El tiempo debe permanecer guardado incluso al recargar la página.

---

# Persistencia de datos

La aplicación debe utilizar:

- `localStorage`

Para guardar:
- lista de tareas
- estado de cada tarea
- tiempo acumulado
- timestamps necesarios para reconstruir el tiempo

Esto permitirá que:
- al refrescar la página
- cerrar el navegador
- volver a abrir la aplicación

las tareas continúen almacenadas.

---

# Requerimientos técnicos obligatorios

## React
La aplicación debe desarrollarse utilizando:
- React
- Hooks (`useState`, `useEffect`)

---

# Arquitectura de componentes

## Componente reutilizable `Card`

Cada tarea debe renderizarse utilizando un único componente reutilizable llamado:

```jsx
<Card />
```

El componente debe recibir información mediante `props`.

---

# Props obligatorias del componente Card

Ejemplo esperado:

```jsx
<Card
  title={todo.title}
  status={todo.status}
  time={todo.time}
  onStart={handleStart}
  onFinish={handleFinish}
  onDelete={handleDelete}
/>
```

---

# Conceptos obligatorios a implementar

## 1. Componentes reutilizables
El componente `Card` debe ser reutilizable y desacoplado.

---

## 2. Props
La información debe viajar desde el componente padre hacia el hijo mediante `props`.

---

## 3. Funciones como props
Las acciones deben enviarse como props:

Ejemplo:
- `onStart`
- `onFinish`
- `onDelete`

---

## 4. Renderizado condicional
La UI debe cambiar dependiendo del estado de la tarea.

Ejemplos:
- Mostrar botón “Iniciar” solo en `pending`
- Mostrar botón “Finalizar” solo en `inprogress`
- No mostrar botones cuando esté `done`

---

## 5. Estilos condicionales
Cada tarjeta debe cambiar visualmente según el estado.

### Colores sugeridos

| Estado | Color |
|---|---|
| Pending | Gris |
| In Progress | Azul |
| Done | Verde |

---

## 6. Temporizador dinámico
Cuando la tarea esté en progreso:
- el contador debe actualizarse automáticamente cada segundo.

---

# Diseño esperado

La aplicación debe incluir:

## Header
Título principal:

```txt
Task Timer
```

---

## Formulario de creación
- Input de texto
- Botón “Crear”

---

## Lista de tareas
Cada tarea mostrará:
- nombre
- estado
- tiempo
- acciones
- botón eliminar

---

# Comportamientos esperados

## Si no existen tareas
Debe mostrarse un mensaje:

```txt
No hay tareas. ¡Crea una para empezar!
```

---

# Estructura sugerida del proyecto

```txt
src/
 ├── components/
 │    └── Card.jsx
 │
 ├── App.jsx
 ├── main.jsx
 ├── styles.css
```

---

# Link de diseño de referencia

https://serifs-chart-85346136.figma.site/

# Requisitos de Git y GitHub

Cada desarrollador deberá:

## Crear un repositorio en GitHub
El repositorio debe contener:
- código fuente
- commits frecuentes
- avance progresivo del proyecto

---

## Buenas prácticas de commits

Ejemplos:

```bash
git commit -m "create reusable Card component"
git commit -m "implement localStorage persistence"
git commit -m "add timer functionality"
```

---

# Despliegue

La aplicación debe ser desplegada en:

https://vercel.com

---

# Entregables

Cada estudiante/desarrollador deberá entregar:

## 1. Repositorio GitHub
Debe incluir:
- historial de commits
- código funcional
- README con instrucciones



---

## 2. Link de despliegue en Vercel
Ejemplo:

```txt
https://mi-task-timer.vercel.app
```

---

# Criterios de aceptación

## La historia se considera completada cuando:

- [ ] Se pueden crear tareas
- [ ] Las tareas se renderizan usando un solo componente `Card`
- [ ] El componente usa `props`
- [ ] Se pasan funciones como props
- [ ] Existe renderizado condicional
- [ ] Existen estilos condicionales según estado
- [ ] El contador funciona correctamente
- [ ] El tiempo final queda guardado
- [ ] Los datos persisten con `localStorage`
- [ ] Se pueden eliminar tareas
- [ ] El proyecto está en GitHub
- [ ] La app está desplegada en Vercel
- [ ] El diseño es responsive
- [ ] La aplicación funciona sin errores

---

# Autor

Creado por **David Henao Bustamante**
