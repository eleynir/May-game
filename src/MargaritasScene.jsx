import React, { useState, useEffect, useRef } from 'react';
import './MargaritasScene.css';
import './gato.css';
import GatoBlue from './gato';

const backgrounds = [
  '/fondos/5.png',
];

const dialogoMargaritas = [
  "Un suave viento acaricia las hojas mientras la ardilla avanza, atraída por un susurro antiguo entre las flores.",
  "El susurro del viento se vuelve más suave, como si le susurrara que está cerca de algo especial.",
  "Avanza entre ramas bajas y hojas secas... hasta que el bosque se abre de golpe en un claro lleno de luz y vida.",
  "Ante sus ojos, un mar de margaritas blancas se extiende, mecidas por la brisa. Son sus favoritas.",
  "Cierra los ojos un momento, respirando el aroma dulce de las flores. Todo parece estar en paz.",
  "Pero algo la hace abrir los ojos... un brillo discreto entre los pétalos blancos y amarillos llama su atención.",
  "Se acerca con cuidado, apartando suavemente las flores.",
  "¡Una bellota! 🌰 ¡Rápido, atrápala!"
];

export default function MargaritasScene({ onFound, onBack, blueEncontrado, marcarBlue }) {
  const [step, setStep] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [minijuegoIniciado, setMinijuegoIniciado] = useState(false);
  const [intentosRestantes, setIntentosRestantes] = useState(5); 
  const [posicion, setPosicion] = useState({ top: '40%', left: '40%' });
  const [tiempoRestante, setTiempoRestante] = useState(15); 
  const [mensaje, setMensaje] = useState("¡Atrapa la bellota antes que se vaya!");
  const minijuegoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (minijuegoIniciado) {
      const moverInterval = setInterval(() => {
        const cont = minijuegoRef.current;
        if (cont) {
          const maxTop = cont.clientHeight - 50;
          const maxLeft = cont.clientWidth - 50;
          const top = Math.floor(Math.random() * maxTop);
          const left = Math.floor(Math.random() * maxLeft);
          setPosicion({ top: `${top}px`, left: `${left}px` });
        }
      }, 800);

      return () => clearInterval(moverInterval);
    }
  }, [minijuegoIniciado]);

  useEffect(() => {
    if (minijuegoIniciado && tiempoRestante > 0) {
      timerRef.current = setTimeout(() => {
        setTiempoRestante(tiempoRestante - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setMensaje("La bellota se cansó y se fue... ¡Intenta de nuevo!");
    }
    return () => clearTimeout(timerRef.current);
  }, [minijuegoIniciado, tiempoRestante]);

  const handleClickDialogo = () => {
    if (!minijuegoIniciado) {
      if (step === dialogoMargaritas.length - 1) {
        setMinijuegoIniciado(true);
      } else {
        setStep(step + 1);
      }
    }
  };

  const atraparBellota = (e) => {
    e.stopPropagation();
    if (tiempoRestante === 0) return; 

    setIntentosRestantes((prev) => {
      const nuevo = prev - 1;

      if (nuevo === 2) {
        setMensaje("¡Casi la tienes!");
      } else if (nuevo > 0) {
        setMensaje("¡Sigue intentando!");
      }

      if (nuevo <= 0) {
        onFound();
        onBack();
        return 0;
      }
      return nuevo;
    });
  };

  const reiniciarMiniJuego = () => {
    setIntentosRestantes(5);
    setTiempoRestante(20);
    setMensaje("¡Atrapa la bellota antes que se vaya!");
  };

  return (
    <div className="margaritas-scene" onClick={handleClickDialogo}>
      {!blueEncontrado && (
        <GatoBlue
          top="87%"
          left="56%"
          scale={2}
          onClick={() => {
            alert("🐾 ¡Encontraste a Blue entre las las margaritas!");
            marcarBlue();
          }}
        />
      )}

      {!minijuegoIniciado ? (
        <div className="dialogo-box">
          <p>{dialogoMargaritas[step]}</p>
          <small>(Haz clic para continuar...)</small>
        </div>
      ) : (
        <div
          className="minijuego"
          ref={minijuegoRef}
          style={{
            position: 'relative',
            height: '60vh',
            border: '2px dashed white',
            margin: 'auto',
            maxWidth: '600px',
            borderRadius: '10px',
            color: 'white',
            userSelect: 'none'
          }}
        >
          <p>{mensaje}</p>
          <p>Intentos restantes: {intentosRestantes}</p>
          <p>Tiempo restante: {tiempoRestante}s</p>

          {tiempoRestante > 0 ? (
            <div
              onClick={atraparBellota}
              style={{
                position: 'absolute',
                top: posicion.top,
                left: posicion.left,
                width: '50px',
                height: '50px',
                backgroundColor: 'saddlebrown',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '24px',
                userSelect: 'none',
                boxShadow: '0 0 10px 2px #fff3b0'
              }}
              title="Haz clic para atrapar la bellota"
            >
              🌰
            </div>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <button onClick={reiniciarMiniJuego}>Intentar de nuevo</button>
              <button onClick={onBack} style={{ marginLeft: '1rem' }}>Volver</button>
            </div>
          )}




        </div>
      )}
    </div>
  );
}
