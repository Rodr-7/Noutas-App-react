## 14-07-25

### 🔔 Añadida funcionalidad: Recordatorios con Notificaciones

#### (con el añadido de esta funcion la app ahora pasa a tener su primera versión numerada: version 1.0)

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

#### Lógica del sistema de notificaciones

    Al agregar o modificar las notas ([notas]), se limpian los setTimeout existentes.

    Se programan nuevos setTimeout para cada nota que tenga recordatorio > Date.now().

    Al llegar el momento, se dispara:

    new Notification("Recordatorio", { body: nota.texto });

    Requiere permisos del usuario (Notification.requestPermission()).

#### Validaciones implementadas

No se permite agregar notas con fechas pasadas.

#### Cambio de fuente personalizada

Se agregó la fuente Ubuntu desde Google Fonts para toda la aplicación.
Desarrolle la app hasta este punto en Linux
Mint, y me gusta la fuente de Ubuntu que viene por defecto:

```css
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap");
```

#### Distribución horizontal de áreas en pantallas anchas

Para que el div .area-notas se vea a un costado de .area-ingreso cuando la pantalla es suficientemente ancha, se utiliza un contenedor .noutas-layout con Flexbox y un media query:

```css
.noutas-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 900px) {
  .noutas-layout {
    flex-direction: row;
    align-items: flex-start;
  }
  .area-ingreso,
  .area-notas {
    flex: 1;
    min-width: 20rem;
  }
}
```

## 13-07-25

### Añadida funcionalidad: Expansion de contenido de notas guardadas

Se agregó el estado `notaExpandida` y se modificó el evento `onClick` de cada `<li>` para expandir o colapsar la nota al hacer clic, mostrando todo su contenido.

`const [notaExpandida, setNotaExpandida] = useState(null);
// ...
onClick={() =>
  setNotaExpandida(notaExpandida === index ? null : index)
}
style={{
  maxHeight: notaExpandida === index ? "none" : "5em",
  overflow: notaExpandida === index ? "visible" : "hidden",
  transition: "max-height 0.3s",
}}`

Botón "Eliminar" solo visible al pasar el mouse
Se agregó el estado hoveredNota y los eventos `onMouseEnter` y `onMouseLeave` en cada `<li>`. El botón "Eliminar" solo aparece cuando el mouse está sobre la nota.

```jsx
const [hoveredNota, setHoveredNota] = useState(null);
// ...
onMouseEnter={() => setHoveredNota(index)}
onMouseLeave={() => setHoveredNota(null)}
// ...`
{hoveredNota === index && (
  <button`
onClick={(e) => {
      e.stopPropagation();
      eliminarNota(index);
}}
>
    Eliminar
  </button>
)}`
```

### Reinicio de expansión

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

### 📦 Componente `NotaItem`

Se ha dividido el componente `li` que renderiza **una nota individual** dentro de la lista, con soporte para:

- **Expandir/colapsar** el texto al hacer clic.
- **Mostrar el botón Eliminar** sólo cuando el puntero está sobre la nota.
- **Eliminar** la nota sin disparar el handler de clic del `<li>` (usa `e.stopPropagation()`).

```jsx
import React from "react";

function NotaItem({
  n, // string · contenido de la nota
  index, // number · posición en el array
  notaExpandida, // number|null · índice actualmente expandido
  setNotaExpandida, // fn · setter del estado en App
  hoveredNota, // number|null · índice que tiene hover
  setHoveredNota, // fn · setter del estado en App
  eliminarNota, // fn · callback para borrar la nota
}) {
  return (
    <li
      className="mi-nota"
      key={index}
      onMouseEnter={() => setHoveredNota(index)}
      onMouseLeave={() => setHoveredNota(null)}
      onClick={() => setNotaExpandida(notaExpandida === index ? null : index)}
      style={{
        cursor: "pointer",
        maxHeight: notaExpandida === index ? "none" : "5em",
        overflow: notaExpandida === index ? "visible" : "hidden",
        transition: "max-height 0.3s",
      }}
      title="Haz clic para expandir"
    >
      {n}
      {hoveredNota === index && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita que el clic llegue al <li>
            eliminarNota(index);
          }}
        >
          Eliminar
        </button>
      )}
    </li>
  );
}
export default NotaItem;
```
