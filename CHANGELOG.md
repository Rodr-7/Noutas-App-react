## 13-07-25

## Agregado

### Expansion de contenido de notas guardadas

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

Reinicio de expansión
al agregar nota
Al agregar una nueva nota, se reinicia el estado de expansión para que ninguna nota quede expandida por defecto.

`const agregarNota = () => {
  if (nota.trim() === "") return;
  setNotas([...notas, nota]);
  setNota("");
  setNotaExpandida(null); // Reinicia expansión
};`

Ahora las notas pueden expandirse/collapsearse al hacer clic, el botón "Eliminar" solo aparece al pasar el mouse sobre la nota, y al agregar una nueva nota, ninguna queda expandida. Todo se mantiene sincronizado con localStorage.

---

## 📦 Componente `NotaItem`

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
