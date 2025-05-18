import { useState, useEffect, useRef } from 'react';
import GatoBlue from './gato';
import { useConnection } from './ConnectionTest';


const rounds = [
  {
    question: '¿Tienes miedo de perder a alguien que te importa?',
    speaker: 'ardilla',
    emotional: true,
    truth: {
      speaker: 'búho',
      response: '...A veces. Pero no dejo que el miedo me detenga.',
    },
    jump: {
      speaker: 'búho',
      response: '¡Salto! Mejor no responder eso ahora.',
    },
  },
  {
    question: '¿Te arrepientes de algo que dijiste alguna vez?',
    speaker: 'búho',
    emotional: true,
    truth: {
      speaker: 'ardilla',
      response: 'Sí. Hay palabras que no vuelven, aunque quisiera que sí.',
    },
    jump: {
      speaker: 'ardilla',
      response: '¡Ups! Esa es una historia para otro día. *salta*',
    },
  },
  {
    question: '¿Qué es lo que más te gusta de mí?',
    speaker: 'ardilla',
    emotional: false,
    truth: {
      speaker: 'búho',
      response: 'Tu energía. Y cómo llenas de vida hasta el silencio.',
    },
    jump: {
      speaker: 'búho',
      response: '¡Paso! Ya me hiciste sonrojar... si los búhos se sonrojan.',
    },
  },
  {
    question: 'Si el mundo se acabara mañana, ¿me buscarías para despedirte?',
    speaker: 'búho',
    emotional: true,
    truth: {
      speaker: 'ardilla',
      response: '¡Claro! Y te llevaría conmigo a saltar por última vez.',
    },
    jump: {
      speaker: 'ardilla',
      response: '¡Salto! Pero… seguro estaría cerca de todas formas.',
    },
  },
];

const speakerName = {
  ardilla: '🐿️ Ardilla',
  búho: '🦉 Búho',
};

export default function VerdadOSalto({ onFinish, blueEncontrado, marcarBlue }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState('question');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);
  const resetClickTimeout = useRef(null);
  const { increaseConnection } = useConnection();
  const [jumpSuccess, setJumpSuccess] = useState(false);
  const REQUIRED_CLICKS = 10;

  const currentRound = rounds[roundIndex];

  useEffect(() => {
    if (phase === 'jumpGame') {
      setClicks(0);
      setJumpSuccess(false);
      setTimeLeft(10);

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase('jumpResult');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleTruth = () => {
    if (currentRound.emotional) {
      increaseConnection(2); 
    } else {
      increaseConnection(-1);
    }
    setPhase('truthResponse');
  };

  const handleJump = () => {
    setPhase('jumpGame');
  };

  const handleClick = () => {
    if (phase !== 'jumpGame') return;

    setClicks((prev) => {
      // No incrementar si ya se llegó al máximo
      if (prev >= REQUIRED_CLICKS) return prev;

      const newClicks = prev + 1;

      // Si justo llega al límite, termina el juego
      if (newClicks === REQUIRED_CLICKS) {
        clearInterval(timerRef.current);
        setJumpSuccess(true);
        setPhase('jumpResult');
      }

      // Reinicia el timeout de reinicio de clics
      if (resetClickTimeout.current) clearTimeout(resetClickTimeout.current);
      resetClickTimeout.current = setTimeout(() => {
        setClicks(0);
      }, 1000);

      return newClicks;
    });
  };


  const handleNextRound = () => {
    if (roundIndex < rounds.length - 1) {
      setRoundIndex(roundIndex + 1);
      setPhase('question');
      setClicks(0);
      setTimeLeft(10);
    } else {
      onFinish();
    }
  };

  return (
    <div className="scene pixel-font" style={{ maxWidth: 640, margin: 'auto', padding: 20 }}>
      {!blueEncontrado && (
        <GatoBlue
          top="90%"
          left="89%"
          scale={2}
          onClick={() => {
            alert('🐾 ¡Encontraste a Blue junto a Mailyn!');
            marcarBlue();
          }}
        />
      )}

      {phase === 'question' && (
        <>
          <div className="dialogue-box">
            <p><strong>{speakerName[currentRound.speaker]}:</strong></p>
            <p>{currentRound.question}</p>
          </div>
          <div className="choices">
            <button onClick={handleTruth}>🗣️ Verdad</button>
            <button onClick={handleJump}>🦘 Salto</button>
          </div>
        </>
      )}

        {phase === 'truthResponse' && (
          <div className="dialogue-box">
            <p className="dialogue-speaker pixel-blink">{speakerName[currentRound.truth.speaker]}:</p>
            <p className="typewriter">{currentRound.truth.response}</p>
            <button onClick={handleNextRound} className="pixel-button">Siguiente</button>
          </div>
        )}

        {phase === 'jumpGame' && (
          <div className="dialogue-box" style={{ textAlign: 'center' }}>
            <p className="dialogue-speaker">¡Rápido, haz click para saltar 10 veces antes de que el tiempo acabe!</p>
            <p>
              ⏳ Tiempo restante: <b>{timeLeft}</b>s
            </p>
            <p>
              🖱️ Clicks: <b>{clicks}</b> / {REQUIRED_CLICKS}
            </p>
              <button
                onClick={handleClick}
                className="pixel-button"
                disabled={clicks >= REQUIRED_CLICKS}
                style={{
                  marginTop: '1rem',
                  padding: '1rem 2rem',
                  fontSize: '0.8rem',
                }}
              >
                ¡Saltar!
              </button>
          </div>
        )}

      {phase === 'jumpResult' && (
        <div className="dialogue-box center-text">
          <p>
            <strong>{speakerName[currentRound.jump.speaker]}</strong>:{" "}
            {jumpSuccess
              ? currentRound.jump.response
              : 'Bueno... eso no fue suficiente para esquivar la pregunta.'}
          </p>
          <p>
            {jumpSuccess
              ? '💨 Saltaste esquivando la pregunta. ¿Impresionante?'
              : '😅 No saltaste lo suficiente. Pero valió el intento.'}
          </p>
          <button onClick={handleNextRound}>Continuar</button>
        </div>
      )}
    </div>
  );
}
