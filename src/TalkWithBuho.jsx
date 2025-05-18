// components/TalkWithBuho.js
import { useState, useEffect, useRef } from 'react';
import './TalkWithBuho.css'

const dialogue = [
  { speaker: 'narrador', text: 'Has traído las bellotas...' },
  { speaker: 'narrador', text: 'El búho observa las bellotas con atención y sonríe suavemente.' },
  { speaker: 'búho', text: 'Has cumplido tu parte, pequeña ardilla. ¿Jugamos ahora?' },
  { speaker: 'ardilla', text: '¡Pensé que no lo dirías nunca! Ya me estaba aburriendo de verte mirar al infinito como estatua filosófica.' },
  { speaker: 'búho', text: 'Estaba reflexionando...' },
  { speaker: 'ardilla', text: '¡Reflexiona después! Hoy toca "Verdad o salto". ¿Preparado para perder, señor sabio?' },
  { speaker: 'búho', text: 'Este juego no se gana ni se pierde.' },
  { speaker: 'ardilla', text: 'Uy qué profundo. Ya, menos palabrería y más acción. Empiezo yo: ¿Alguna vez te has reído solo cuando piensas en mí?' },
  { speaker: 'búho', text: 'Tal vez. No negaré que tus... irrupciones me dejan pensando más de lo que quisiera.' },
  { speaker: 'ardilla', text: '¡Eso es un sí disfrazado! Ahora te toca.' },
  { speaker: 'búho', text: '¿Por qué siempre estás corriendo y hablando como si el tiempo se acabara?' },
  { speaker: 'ardilla', text: 'Porque si me detengo... empiezo a pensar. Y a veces no quiero pensar tanto como tú.' },
  { speaker: 'búho', text: '...Entonces jugaremos. Pero no hagas trampa.' },
  { speaker: 'ardilla', text: '¿Quién? ¿Yo? Jamás. Bueno, a veces. Pero hoy prometo solo un poquito.' },
];


export default function TalkWithBuho({ onNextScene, setCurrentSong, audioRef }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setCurrentSong('/piano2.mp3');
    if (audioRef.current) {
      audioRef.current.currentTime = 5;
      audioRef.current.play().catch((err) => console.log('Error al reproducir:', err));
    }
  }, []);

  const isLastDialogue = index === dialogue.length - 1;

  const handleNext = () => {
    if (!isLastDialogue) {
      setIndex(index + 1);
    } else {
      onNextScene(); // Avanza directamente al juego
    }
  };

  return (
    <div className="scene">
      {dialogue[index] && (
        <div className="dialogue-box">
          <p className="dialogue-speaker">
            {dialogue[index].speaker === 'búho'
              ? '🦉 Búho:'
              : dialogue[index].speaker === 'ardilla'
              ? '🐿️ Ardilla:'
              : ''}
          </p>
          <p className="dialogue-text">{dialogue[index].text}</p>
        </div>
      )}
      <button onClick={handleNext}>
        {isLastDialogue ? 'Comenzar el juego' : 'Siguiente'}
      </button>
    </div>
  );
}