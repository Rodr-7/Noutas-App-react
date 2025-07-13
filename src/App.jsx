import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nota, setNota] = useState(""); // Texto que se está escribiendo
  const [notas, setNotas] = useState(() => {
    const notasGuardadas = localStorage.getItem("misNotas");
    return notasGuardadas ? JSON.parse(notasGuardadas) : [];
  });
  const [notaExpandida, setNotaExpandida] = useState(null); // Gancho para controlar la nota expandida
  const [hoveredNota, setHoveredNota] = useState(null); // Gancho para controlar la nota sobre la que está pasando el mouse
  // Función que se ejecuta al hacer clic en el botón
  const agregarNota = () => {
    if (nota.trim() === "") return; // Evita guardar notas vacías
    setNotas([...notas, nota]); // Agrega nueva nota al array
    setNota(""); // Limpia el campo de texto
    setNotaExpandida(null); // ← Añade esta línea
  };

  const eliminarNota = (indice) => {
    const nuevasNotas = notas.filter((_, i) => i !== indice); // En cada nota verifica si su índice i es distinto al que queremos eliminar. El resultado es un nuevo array sin esa nota.

    setNotas(nuevasNotas); // Luego, setNotas(...) actualiza la lista.
  };

  // Efecto para cargar y guardar notas en localStorage ---------------
  // Cargar notas guardadas en localStorage al iniciar la app
  useEffect(() => {
    const notasGuardadas = localStorage.getItem("misNotas");
    console.log("Cargando notas:", notasGuardadas);
    if (notasGuardadas) {
      setNotas(JSON.parse(notasGuardadas));
    }
  }, []);

  // Guardar notas en localStorage al realizar cambios
  useEffect(() => {
    console.log("Guardando notas:", notas);
    localStorage.setItem("misNotas", JSON.stringify(notas));
  }, [notas]);

  // Renderizado de la interfaz de usuario ---------------------------
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Noutas</h1>

      <div className="area-ingreso">
        <textarea
          placeholder="Escribe una nota..."
          value={nota}
          onChange={(e) => setNota(e.target.value)} // Cada vez que el usuario escribe
        />
        <button onClick={agregarNota}>Agregar</button>
      </div>
      <button className="ver-ocultar-notas">
        Ver / ocultar notas guardadas
      </button>
      <div className="area-notas">
        <h2>Mis Notas</h2>
        <ul>
          {notas.map((n, index) => (
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
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
