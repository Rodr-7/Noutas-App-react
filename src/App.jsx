import { useState, useEffect, useRef } from "react";
import "./App.css";
import NotaItem from "./components/NotaItem";

function App() {
  const timeoutsRef = useRef({}); // Guarda los setTimeout por índice
  const [nota, setNota] = useState(""); // Texto que se está escribiendo
  const [notas, setNotas] = useState(() => {
    const guardadas = localStorage.getItem("misNotas");
    const parseadas = guardadas ? JSON.parse(guardadas) : [];
    return parseadas.map((n) => (typeof n === "string" ? { texto: n } : n));
  });
  const [fechaRecordatorio, setFechaRecordatorio] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [notaExpandida, setNotaExpandida] = useState(null); // Gancho para controlar la nota expandida
  const [hoveredNota, setHoveredNota] = useState(null); // Gancho para controlar la nota sobre la que está pasando el mouse
  // Función que se ejecuta al hacer clic en el botón Agregar
  const agregarNota = () => {
    if (nota.trim() === "") return; // Evita guardar notas vacías

    // Si hay fecha, la convertimos a timestamp
    const recordatorioTimestamp = fechaRecordatorio
      ? new Date(fechaRecordatorio).getTime()
      : undefined;

    // Validación: la fecha debe estar en el futuro
    if (recordatorioTimestamp && recordatorioTimestamp <= Date.now()) {
      setErrorFecha("La fecha del recordatorio debe ser futura ⏰");
      return;
    }
    // Si todo va bien, limpiamos el error
    setErrorFecha("");

    // Crea el objeto de nota
    const nuevaNota = {
      texto: nota,
      recordatorio: recordatorioTimestamp,
    };

    setNotas([...notas, nuevaNota]); // Agrega la nota
    setNota(""); // Limpia textarea
    setFechaRecordatorio(""); // Limpia input de fecha
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

  // Efecto para manejar recordatorios de notas ----------------------
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Limpia todos los timeouts anteriores
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};

    // Recorre todas las notas y programa nuevos timeouts
    notas.forEach((nota, idx) => {
      // idx es el índice de la nota, para asociar cada timeout a una
      if (!nota.recordatorio) return;

      const tiempoRestante = nota.recordatorio - Date.now();
      if (tiempoRestante <= 0 || tiempoRestante > 2147483647) return;

      const id = setTimeout(() => {
        new Notification("Recordatorio", {
          body: nota.texto,
        });
      }, tiempoRestante);

      // Guarda el id para poder cancelarlo luego si es necesario
      timeoutsRef.current[idx] = id;
    });
  }, [notas]);

  // -----------------Renderizado de la interfaz de usuario ---------------------------
  return (
    <div style={{ padding: "1rem" }}>
      <h1 className="titulo-app">
        Noutas <img src={`${import.meta.env.BASE_URL}icono.ico`} alt="logo" />
      </h1>
      <div className="noutas-layout">
        <div className="area-ingreso">
          <h2>Agregar Nota</h2>
          {/* Área de ingreso de notas */}
          <textarea
            placeholder="Escribe una nota..."
            value={nota}
            onChange={(e) => setNota(e.target.value)} // Cada vez que el usuario escribe
          />
          <input // Campo para seleccionar fecha y hora del recordatorio
            className="fecha-recordatorio"
            type="datetime-local"
            value={fechaRecordatorio}
            onChange={(e) => {
              const nuevaFecha = e.target.value;
              setFechaRecordatorio(nuevaFecha);

              // Validación inmediata: si la fecha nueva es futura, limpiamos el error
              const timestamp = new Date(nuevaFecha).getTime();
              if (timestamp > Date.now()) {
                setErrorFecha("");
              }
            }}
          />
          {/* Mensaje de error si la fecha es inválida */}
          {errorFecha && <p className="error-mensaje">{errorFecha}</p>}
          <button onClick={agregarNota}>Agregar</button>
        </div>
        <div className="area-notas">
          <h2>Mis Notas</h2>
          <ul>
            {notas.map((n, index) => (
              <NotaItem
                n={n}
                index={index}
                notaExpandida={notaExpandida}
                setNotaExpandida={setNotaExpandida}
                hoveredNota={hoveredNota}
                setHoveredNota={setHoveredNota}
                eliminarNota={eliminarNota}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
