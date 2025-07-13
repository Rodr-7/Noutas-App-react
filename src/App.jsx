import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nota, setNota] = useState(""); // Texto que se está escribiendo
  const [notas, setNotas] = useState(() => {
    const notasGuardadas = localStorage.getItem("misNotas");
    return notasGuardadas ? JSON.parse(notasGuardadas) : [];
  });

  // Función que se ejecuta al hacer clic en el botón
  const agregarNota = () => {
    if (nota.trim() === "") return; // Evita guardar notas vacías

    setNotas([...notas, nota]); // Agrega nueva nota al array
    setNota(""); // Limpia el campo de texto
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
          onInput={(e) => {
            // Ajusta el alto del textarea al contenido
            e.target.style.height = "100px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
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
              onClick={() => navigator.clipboard.writeText(n)}
              style={{ cursor: "pointer" }}
              title="Haz clic para copiar"
            >
              {n}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Detiene que el clic llegue al <li>
                  eliminarNota(index);
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
