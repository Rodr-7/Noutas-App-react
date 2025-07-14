# Noutas App

Aplicación de notas rápida hecha en React + Vite.

## Cómo usar

1. Clona el repositorio
2. Instala dependencias con npm install
3. Inicia la app con npm run dev

## Funciones

- Agrega notas rápidas
- Programar un recordatorio para las notas
- Guardado de notas en localStorage de navegador

### Proximas funciones

- Editar notas
- Titulo para las notas
- Formateo de texto dentro de notas (negrita, cursiva, tachado y listas de puntos)

## Ultimos cambios

### 🔔 Añadida funcionalidad: Recordatorios con Notificaciones (Versión 1.0)

Ahora las notas pueden tener recordatorios programados, los cuales se activan en forma de notificaciones del navegador a la fecha y hora seleccionadas por el usuario.

#### Como se implementó

- Campo de entrada `datetime-local` para seleccionar día y hora del recordatorio.
- Validación automática para evitar seleccionar fechas pasadas.
- Notificación visual en pantalla si la fecha es inválida.
- Programación de `setTimeout` para cada nota con recordatorio válido.
- Persistencia del `recordatorio` junto con el texto de la nota en `localStorage`.
- Limpieza automática de los `setTimeout` al modificar las notas.
- Visualización del 📅 recordatorio en cada nota, debajo del texto.

---

### ✨ Estructura de datos actualizada

Cada nota ahora tiene esta forma:

```js
{
  texto: "Estudiar para la prueba",
  recordatorio: 1721122800000 // Timestamp (opcional)
}
```

### Mejoras de calidad de vida

#### Expansión de notas al hacer clic

Se agregó el estado `notaExpandida` y se modificó el evento `onClick` de cada `<li>` para expandir o colapsar la nota al hacer clic, mostrando todo su contenido.

```jsx
const [notaExpandida, setNotaExpandida] = useState(null);
// ...
onClick={() =>
  setNotaExpandida(notaExpandida === index ? null : index)
}
style={{
  maxHeight: notaExpandida === index ? "none" : "5em",
  overflow: notaExpandida === index ? "visible" : "hidden",
  transition: "max-height 0.3s",
}}
```

Botón "Eliminar" solo visible al pasar el mouse
Se agregó el estado hoveredNota y los eventos `onMouseEnter` y `onMouseLeave` en cada `<li>`. El botón "Eliminar" solo aparece cuando el mouse está sobre la nota.

```jsx
const [hoveredNota, setHoveredNota] = useState(null);`
// ...
`onMouseEnter={() => setHoveredNota(index)}
onMouseLeave={() => setHoveredNota(null)}
// ...`
`{hoveredNota === index && (
  <button`
`onClick={(e) => {
      e.stopPropagation();
      eliminarNota(index);`
`}}`
`>
    Eliminar
  </button>
)}
```

Reinicio de expansión al agregar nota
Al agregar una nueva nota, se reinicia el estado de expansión para que ninguna nota quede expandida por defecto.

```jsx
const agregarNota = () => {
  if (nota.trim() === "") return;
  setNotas([...notas, nota]);
  setNota("");
  setNotaExpandida(null); // Reinicia expansión
};
```

Ahora las notas pueden expandirse/collapsearse al hacer clic, el botón "Eliminar" solo aparece al pasar el mouse sobre la nota, y al agregar una nueva nota, ninguna queda expandida. Todo se mantiene sincronizado con localStorage.

---

<details>
<summary>Información técnica (Vite)</summary>

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- @vitejs/plugin-react uses Babel for Fast Refresh
- @vitejs/plugin-react-swc uses SWC for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the TS template for information on how to integrate TypeScript and `typescript-eslint` in your project.

</details>
