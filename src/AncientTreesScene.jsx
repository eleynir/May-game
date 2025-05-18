import React, { useState, useEffect, useRef, useMemo } from 'react';
import './AncientTreesScene.css';
import './gato.css';
import GatoBlue from './gato';
import { useConnection } from './ConnectionTest';

const TIEMPO_RESPUESTA = 10;

const susurrosOscuros = [
  {
    frase: "Eres pequeño. No deberías estar aquí.",
    opciones: [
      { texto: "Quizá no... pero igual lo intentaré.", valor: 2 },
      { texto: "No lo sé. Solo estoy explorando.", valor: 0 },
      { texto: "Tienes razón, no puedo.", valor: -1 }
    ]
  },
  {
    frase: "Nadie te está esperando. A nadie le importas.",
    opciones: [
      { texto: "Eso no es verdad.", valor: 2 },
      { texto: "Tal vez solo soy yo mismo...", valor: 0 },
      { texto: "Entonces, ¿para qué seguir?", valor: -1 }
    ]
  },
  {
    frase: "Te vas a perder, como todos los que lo intentaron.",
    opciones: [
      { texto: "Quizá, pero no me quedaré aquí.", valor: 2 },
      { texto: "No sé qué hacer.", valor: 0 },
      { texto: "Sí... esto es demasiado.", valor: -1 }
    ]
  },
  {
    frase: "Nunca has sido valiente. Solo tienes suerte.",
    opciones: [
      { texto: "No necesito suerte, tengo decisión.", valor: 2 },
      { texto: "Puede que tenga un poco de ambas.", valor: 0 },
      { texto: "Tienes razón. Solo he tenido suerte.", valor: -1 }
    ]
  },
  {
    frase: "Todo esto... es una pérdida de tiempo.",
    opciones: [
      { texto: "Cada paso vale por sí mismo.", valor: 2 },
      { texto: "No lo sé... pero ya estoy aquí.", valor: 0 },
      { texto: "Entonces mejor me rindo.", valor: -1 }
    ]
  }
];

 function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
  }

export default function AncientTreeScene({ onFound, onBack, blueEncontrado, marcarBlue, puntuacionSalto }) {
  const [step, setStep] = useState(0);
  const [minijuego, setMinijuego] = useState(false);
  const [indice, setIndice] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIEMPO_RESPUESTA);
  const [bloqueado, setBloqueado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mensajeFinal, setMensajeFinal] = useState('');
  const timerRef = useRef(null);
  const { increaseConnection } = useConnection();

    const opcionesMezcladas = useMemo(() => {
    if (!minijuego) return [];
    return shuffleArray(susurrosOscuros[indice].opciones);
  }, [indice, minijuego]);


  useEffect(() => {
    if (minijuego && !juegoTerminado) {
      setTimeLeft(TIEMPO_RESPUESTA);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            manejarRespuesta(-1); // se acabó el tiempo
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [indice, minijuego, juegoTerminado]);

  const avanzarDialogo = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setMinijuego(true);
    }
  };

  const manejarRespuesta = (valor) => {
    if (bloqueado || juegoTerminado) return;
    clearInterval(timerRef.current);
    setBloqueado(true);

    let incremento = 0;
    let nuevoError = null;

    if (valor === 2) {
      incremento = 25;
      increaseConnection(1);
    } else if (valor === 0) {
      incremento = 0;
      nuevoError = "El árbol duda de tu convicción...";
    } else {
      incremento = -15;
      nuevoError = "El árbol ríe con desprecio... tus dudas lo alimentan.";
    }

    setProgreso((p) => {
      const nuevo = Math.max(0, Math.min(100, p + incremento));
      return nuevo;
    });

    setError(nuevoError);

    setTimeout(() => {
      setError(null);
      if (indice + 1 >= susurrosOscuros.length) {
        terminarJuego();
      } else {
        setIndice(indice + 1);
        setBloqueado(false);
      }
    }, 1500);
  };

  const terminarJuego = () => {
    setJuegoTerminado(true);
    const totalPuntos = progreso + puntuacionSalto;

    if (progreso >= 75) {
      setMensajeFinal("🌰 Las raíces ceden... una luz cálida emana de la tierra.");
    } else if (totalPuntos >= 90) {
      setMensajeFinal("🌳 A pesar de las dudas, tu determinación ha dejado huella.");
    } else {
      setMensajeFinal("🌫️ El árbol permanece en silencio. No estás listo aún.");
    }
  };

  const reiniciarJuego = () => {
    setIndice(0);
    setProgreso(0);
    setError(null);
    resetConnection(); 
    setJuegoTerminado(false);
    setMensajeFinal('');
    setBloqueado(false);
  };

  const finalizar = () => {
    if (progreso >= 75 && marcarBlue) marcarBlue();
    onFound();
    onBack();
  };

  return (
    <div className="ancient-tree-scene" onClick={!minijuego && !juegoTerminado ? avanzarDialogo : undefined}>
            {!blueEncontrado && (
              <GatoBlue
                top="60%"
                left="20%"
                scale={2}
                onClick={() => {
                  alert("🐾 ¡Encontraste a Blue entre las raíces!");
                  marcarBlue();
                }}
              />
            )}
      {!minijuego && !juegoTerminado && (
        <div className="dialogo-box">
          <p>{dialogoRaices[step]}</p>
          
          <small>(Haz clic para continuar...)</small>
        </div>
      )}

      {minijuego && !juegoTerminado && (
        <div className="minijuego">
          <p className="frase-susurro">"{susurrosOscuros[indice].frase}"</p>
          <div className="opciones">
            {opcionesMezcladas.map((op, i) => (
              <button
                key={i}
                className="opcion-btn"
                onClick={() => manejarRespuesta(op.valor)}
                disabled={bloqueado}
              >
                {op.texto}
              </button>
            ))}
          </div>
          <p>Tiempo restante: {timeLeft}s</p>
          {error && <p className="error">{error}</p>}
          <progress value={progreso} max="100" />
        </div>
      )}

      {juegoTerminado && (
        <div className="final-arbol">
          <p className="frase-susurro">{mensajeFinal}</p>
          <div className="opciones">
            <button className="opcion-btn" onClick={reiniciarJuego}>Intentar de nuevo</button>
            <button className="opcion-btn" onClick={finalizar}>Seguir explorando</button>
          </div>
        </div>
      )}

      {!blueEncontrado && (
        <GatoBlue top="60%" left="20%" scale={0.8} />
      )}
    </div>
  );
}

const dialogoRaices = [
  "Llegas a un árbol colosal. Su tronco es tan ancho que podrías tardar minutos en rodearlo.",
  "Las raíces sobresalen del suelo como brazos dormidos, retorcidos por el paso del tiempo.",
  "Entre las grietas, hay algo brillante... pero está cubierto de tierra.",
  "Te acercas... pero el árbol parece susurrar algo. ¿Imaginación? No lo parece. 🕳️🌰"
];
