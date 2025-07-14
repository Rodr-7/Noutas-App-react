import React from "react";

function NotaItem({
  n,
  index,
  notaExpandida,
  setNotaExpandida,
  hoveredNota,
  setHoveredNota,
  eliminarNota,
}) {
  return (
    <li
      className="mi-nota"
      onMouseEnter={() => setHoveredNota(index)} // Activa el estado de hover para mostrar el botón
      onMouseLeave={() => setHoveredNota(null)} // Lo desactiva al salir
      onClick={() =>
        // Al hacer clic en la nota, esta expande o colapsa su contenido
        setNotaExpandida(notaExpandida === index ? null : index)
      }
      style={{
        cursor: "pointer",
        maxHeight: notaExpandida === index ? "none" : "5em",
        overflow: notaExpandida === index ? "visible" : "hidden",
        transition: "max-height 0.3s",
      }}
      title="Haz clic para expandir"
    >
      {/* Texto principal de la nota */}
      {n.texto}

      {/* Muestra la fecha y hora del recordatorio si existe */}
      {n.recordatorio && (
        <small>
          📅{" "}
          {new Date(n.recordatorio).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </small>
      )}

      {/* Botón Eliminar que aparece solo cuando el mouse está sobre la nota */}
      {hoveredNota === index && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Detiene que el clic llegue al <li>
            eliminarNota(index); // Llama a la función para eliminar la nota
          }}
        >
          Eliminar
        </button>
      )}
    </li>
  );
}

export default NotaItem;
