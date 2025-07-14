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
      key={index}
      onMouseEnter={() => setHoveredNota(index)}
      onMouseLeave={() => setHoveredNota(null)}
      onClick={() =>
        // Al hacer clic en la nota esta expande su contenido
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
      {n}
      {hoveredNota === index && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Detiene que el clic llegue al <li>
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
