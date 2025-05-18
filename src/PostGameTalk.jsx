import { useState } from 'react';
import './PostGameTalk.css';
import { useConnection } from './ConnectionTest';

const dialogues = {
  alta: [
    {
      speaker: 'narrador',
      text: 'La noche cae suavemente sobre el claro. En lo alto de una rama, el búho y la ardilla comparten un silencio que no pesa.',
    },
    {
      speaker: 'ardilla',
      text: '¿Sabes? No pensé que me divertiría tanto contigo.',
    },
    {
      speaker: 'búho',
      text: 'Ni yo. Creí que el juego sería solo una distracción... pero fue como mirarse en el agua, cuando está quieta.',
    },
    {
      speaker: 'ardilla',
      text: 'Tú hablas raro... pero entiendo. A veces me asustas, ¿sabes?',
    },
    {
      speaker: 'búho',
      text: '¿Por qué?',
    },
    {
      speaker: 'ardilla',
      text: 'Porque me haces pensar. Y yo solo quiero brincar. Pero contigo... me detengo.',
    },
    {
      speaker: 'búho',
      text: 'Y tú me haces saltar. Aunque mi alma prefiera quedarse en la rama más alta.',
    },
    {
      speaker: 'ardilla',
      text: 'Oye... ¿crees que somos muy distintos?',
    },
    {
      speaker: 'búho',
      text: 'Sí. Pero quizá por eso encajamos. Como noche y fuego, raíz y viento.',
    },
    {
      speaker: 'narrador',
      text: 'La brisa mueve las hojas. Dos siluetas distintas, unidas por lo invisible, se quedan mirando las estrellas. Y por un instante… todo está bien.',
    },
  ],
  media: [
    {
      speaker: 'narrador',
      text: 'El cielo se cubre de estrellas, y el claro se vuelve espejo del silencio.',
    },
    {
      speaker: 'ardilla',
      text: 'Fue... más divertido de lo que pensé.',
    },
    {
      speaker: 'búho',
      text: 'Sí. Fue distinto. Como si dijéramos cosas sin decirlas.',
    },
    {
      speaker: 'ardilla',
      text: 'No sé si te entiendo siempre. Pero igual... me caes bien.',
    },
    {
      speaker: 'búho',
      text: 'Y tú me desconciertas. Pero me haces reír.',
    },
    {
      speaker: 'ardilla',
      text: 'Tal vez no somos tan distintos. Solo brincamos distinto.',
    },
    {
      speaker: 'narrador',
      text: 'Se miran sin hablar. Hay preguntas que flotan, pero no pesan. Y eso, por ahora, es suficiente.',
    },
  ],
  baja: [
    {
      speaker: 'narrador',
      text: 'La noche ha caído, y el claro vuelve a estar en calma.',
    },
    {
      speaker: 'ardilla',
      text: 'Bueno... eso fue raro.',
    },
    {
      speaker: 'búho',
      text: 'Sí. No fue lo que esperaba.',
    },
    {
      speaker: 'ardilla',
      text: 'Tú eres... complicado.',
    },
    {
      speaker: 'búho',
      text: 'Y tú eres impredecible.',
    },
    {
      speaker: 'narrador',
      text: 'Ambos ríen, pero con distancia. No todos los encuentros dejan raíces. Algunos solo enseñan a volar... o a brincar.',
    },
  ],
};

const speakerName = {
  ardilla: '🐿️ Ardilla',
  búho: '🦉 Búho',
  narrador: 'Narrador',
};

export default function PostGameTalk({ onNext }) {
  const { connection } = useConnection();
  const [index, setIndex] = useState(0);

  // Elegir diálogo según conexión
  const selectedDialogue =
    connection >= 6
      ? dialogues.alta
      : connection >= 3
      ? dialogues.media
      : dialogues.baja;

  const current = selectedDialogue[index];

  const handleNext = () => {
    if (index < selectedDialogue.length - 1) {
      setIndex(index + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="postgame-background">
      <div className="dialogue-container">
        <div className="dialogue-box">
          {current.speaker && (
            <p className="dialogue-speaker">{speakerName[current.speaker]}:</p>
          )}
          <p className="dialogue-text">{current.text}</p>
        </div>
        <button onClick={handleNext}>
          {index < selectedDialogue.length - 1 ? 'Siguiente' : 'Terminar'}
        </button>
      </div>
    </div>
  );
}
