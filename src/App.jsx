import { useState, useRef, useEffect } from 'react';
import ParallaxBackground from './ParallaxBackground';
import ParallaxForestBackground from './ParallaxTreesBackground';
import './index.css';
import MargaritasScene from './MargaritasScene';
import AncientTreeScene from './AncientTreesScene';
import MemoryLeafGame from './MemoryLeafGame';
import TalkWithBuho from './TalkWithBuho';
import VerdadOSalto from './VerdadJuego';
import PostGameTalk from './PostGameTalk';
import PostGameEpilogue from './PostGameEpilogue';
import { ConnectionProvider } from './ConnectionTest';

function Typewriter({ text, speed = 20, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          clearInterval(interval);
          if (onDone) onDone();
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="typewriter-container">
      <p className="typewriter">
        {text.split('').map((char, i) => (
          <span key={i} style={{ visibility: i <= currentIndex ? 'visible' : 'hidden' }}>
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}


const cuentoIntro = `Había una vez un claro secreto en medio del bosque, donde la luz del sol apenas se atrevía a entrar, y donde el silencio tenía un sonido propio...

Allí vivía un búho distinto a los demás. No era sabio por viejo, ni fuerte por fiero; era sabio por sensible. Observaba todo desde una rama alta, donde pensaba, reflexionaba, y a veces, simplemente se perdía en el ir y venir de las hojas.

Un día, una ardilla irrumpió en su espacio. Era puro ruido, puro movimiento. Molestosa y encantadora. Y sin embargo, había algo en ella que lo detenía.

A veces, solo a veces, eso es más que suficiente.
`;

const poemaMailyn = `
Mailyn, experta en hablar sin parar,  
dulce con chocolates, odiosa sin avisar.  

Amante de margaritas y charlas sin control,  
a veces quiero que te calles, pero igual me haces el rol.  

No sé cuándo terminas, pero disfruto el rato,  
aunque a veces me hartes, no te cambio por otro trato.  

Sigue o para, tú decides el guion,  
yo aquí aguantando el show… porque vale la ocasión.
`;

function App() {
  const [scene, setScene] = useState('start');
  const [secret, setSecret] = useState(false);
  const [started, setStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [introComplete, setIntroComplete] = useState(false);
  const audioRef = useRef(null);
  const [collectedAcorns, setCollectedAcorns] = useState(0);  
  const [acornFound, setAcornFound] = useState(false); 
  const [dialogIndex, setDialogIndex] = useState(0);
  const [hasTalkedToBuho, setHasTalkedToBuho] = useState(false);
  const [foundAcorn1, setFoundAcorn1] = useState(false);
  const [foundAcorn2, setFoundAcorn2] = useState(false);
  const [foundAcorn3, setFoundAcorn3] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [blueEncontrado, setBlueEncontrado] = useState({
  ancientTree: false,
  margaritas: false,
  verdadJuego: false,
});



const marcarBlueComoEncontrado = (sceneName) => {
  setBlueEncontrado(prev => ({
    ...prev,
    [sceneName]: true
  }));
};


  
const collectAcorn = () => {
  if (collectedAcorns < 3) {
    setCollectedAcorns(prev => prev + 1); 
    setAcornFound(true);  
    setTimeout(() => setAcornFound(false), 1000);  
  }
};

useEffect(() => {
  const allFound = Object.values(blueEncontrado).every(found => found === true);
  if (allFound) {
    setShowReward(true);
  }
}, [blueEncontrado]);

useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;

    if (currentSong) {
      audio.src = currentSong;
      audio.volume = 0.5;
      audio.loop = true;

      audio.onloadedmetadata = () => {
        if (currentSong === '/piano2.mp3') {
          audio.currentTime = 2;
        }
        audio.play().catch((err) => console.log("No se pudo reproducir:", err));
      };
    }
  }
}, [currentSong]);

useEffect(() => {
  if (scene === 'epilogue') {
    setCurrentSong('/piano3.mp3'); 
  }
}, [scene]);

  useEffect(() => {
  if (scene === 'talk') {
    setDialogIndex(0);
  }
}, [scene]);

useEffect(() => {
  if (scene === 'talk' && !hasTalkedToBuho) {
    setDialogIndex(0);
  } else if (scene === 'waitingForAcorns') {

    setDialogIndex(0); 
  }
}, [scene, hasTalkedToBuho]);

const dialogoConBuho = [
  { speaker: 'búho', text: 'Oh... una visitante ruidosa. Qué inesperado.' },
  { speaker: 'ardilla', text: '¡Hola! No quería molestarte. Solo tengo mucha energía.' },
  { speaker: 'búho', text: 'No es molestia... solo inusual. Hace tiempo que no hablaba con nadie.' },
  { speaker: 'ardilla', text: '¿Y qué haces aquí tan callado?' },
  { speaker: 'búho', text: 'Observo. Escucho. A veces, pienso. Es lo que mejor se me da.' },
  { speaker: 'ardilla', text: 'Me parece que podrías enseñarme a hacer eso. Yo solo... salto y hablo.' },
  { speaker: 'búho', text: 'Y eso es lo que te hace especial. El bosque necesita ruido... tanto como silencio.' },
  { speaker: 'búho', text: 'Si realmente deseas ayudarme, ve y recolecta tres bellotas. Tal vez después podamos jugar algo... si logras encontrarlas.' },
  { speaker: 'ardilla', text: '¡Tres bellotas! ¡Eso suena emocionante! Volveré pronto con ellas.' }
];

  return (
        <ConnectionProvider>
    
    <div className="app">
      <img 
        src="/Chibi.png" 
        alt="Chibi de ella" 
        className="floating-chibi"
      />
      <audio ref={audioRef} loop />

{(scene === 'explore') && <ParallaxForestBackground />}
{(scene !== 'margaritas' && scene !== 'postGameTalk') && <ParallaxBackground />}


      <div className="content">
          <div className="acorn-counter">
            <p>Bellotas recolectadas: {collectedAcorns}</p>
          </div>

            {/* Notificación de Bellota encontrada */}
            {acornFound && (
              <div className="acorn-notification">
                ¡Has encontrado una bellota! 🌰
              </div>
            )}

              {scene === 'start' && (
                <div className="scene">
                  {!started ? (
                    <>
                      <h1>Bienvenida a tu regalo de cumpleaños Belén</h1>
                      <button
                          onClick={() => {
                            setStarted(true);
                            setShowIntro(true);
                            setCurrentSong('/piano.mp3');
                          }}
                        >
                          Empezar
                      </button>
                    </>
                  ) : !introComplete ? (
                    <Typewriter
                      text={cuentoIntro}
                      speed={30}
                      onDone={() => {
                        setIntroComplete(true);
                        setFinalText(cuentoIntro);
                      }}
                    />
                  ) : (
                  <>
                    <div className="typewriter-container">
                      <p className="typewriter">{finalText}</p>
                    </div>
                    <button onClick={() => setScene('choice')}>Siguiente</button>
                  </>
                  )}
                </div>
              )}

              {scene === 'choice' && (
                <div className="scene">
                  <h2>Ahora... ¿qué te gustaría hacer en este bosque encantado?</h2>
                  <p>Puedes elegir tu propio camino, pequeña ardilla curiosa 🐿️✨</p>
                  <button onClick={() => {
                    if (hasTalkedToBuho) {
                      setScene('explore');
                    } else {
                      setShowReminder(true);
                    }
                  }}>
                    Explorar el bosque 
                  </button>
                  <button onClick={() => setScene('talk')}>Hablar con el búho</button>
                </div>
              )}

              {scene === 'explore' && (
                <div className="scene">
                  <ParallaxForestBackground />
                  
                  <div className="explore-content">
                    <p>
                      Caminas entre árboles altos que susurran historias antiguas. La luz del sol se cuela entre las hojas, pintando el suelo con destellos dorados... 🌿✨
                      <br /><br />
                      En el silencio, escuchas tu propio corazón. Y por un momento, todo parece estar en su lugar.
                    </p>

                    
                    {/* Bellota 1: Claro de margaritas */}
                    {!foundAcorn1 ? (
                      <button onClick={() => {
                        setScene('margaritas'); // Ir al nuevo escenario animado
                      }}>
                        Buscar en el claro de margaritas 🌼
                      </button>
                    ) : (
                      <p className="found-text">
                          La bellota brilla suave entre las margaritas, como un secreto guardado por la luz del sol y el susurro del viento.
                      </p>
                    )}

                    {/* Bellota 2: Entre las raíces de un árbol */}
                    {!foundAcorn2 ? (
                      <button onClick={() => {
                        setScene('raices');
                      }}>
                        Explorar las raíces de un árbol antiguo 🌳
                      </button>
                    ) : (
                      <p className="found-text">
                        Entre las raíces profundas, la bellota descansa firme, testigo silencioso de historias que el bosque guarda en su corazón.
                      </p>
                    )}

                    {/* Bellota 3: Bajo las hojas caídas */}
                      {!foundAcorn3 ? (
                        <>
                          {!showMemoryGame && (
                            <button onClick={() => {
                              setShowDialog(true);
                            }}>
                              Revolver las hojas caídas 🍂
                            </button>
                          )}

                          {showDialog && (
                            <div className="dialog-wrapper">
                              <Typewriter
                                text={`"Hmm... estas hojas no se ven normales. Algo me dice que esto no será tan simple como apartarlas."`}
                                onDone={() => {
                                  // Espera 2 segundos antes de cerrar el diálogo y mostrar el juego
                                  setTimeout(() => {
                                    setShowDialog(false);
                                    setShowMemoryGame(true);
                                  }, 4000);
                                }}
                              />
                            </div>
                          )}

                          {showMemoryGame && (
                            <MemoryLeafGame
                              onFound={() => {
                                setFoundAcorn3(true);
                                setCollectedAcorns(prev => prev + 1);
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <p className="found-text">  
                          Bajo el manto dorado de hojas, la  bellota revela el misterio más dulce que el bosque guardaba solo para ti.
                        </p>
                      )}


                    <button onClick={() => setScene('choice')}>Volver al claro</button>
                  </div>
                </div>
              )}

              {scene === 'talk' && (
                <div className="scene dialogue-scene">
                  {collectedAcorns >= 3 ? (
                    // Si el jugador tiene las 3 bellotas, redirigir a 'talkWithBuho'
                    setScene('talkWithBuho')
                  ) : !hasTalkedToBuho ? (
                    // Si el jugador no ha hablado antes con el búho, mostrar diálogos
                    dialogoConBuho[dialogIndex] ? (
                      <div className="dialogue-box">
                        <p className="dialogue-speaker">
                          {dialogoConBuho[dialogIndex].speaker === 'búho' ? '🦉 Búho:' : '🐿️ Ardilla:'}
                        </p>
                        <p className="dialogue-text">{dialogoConBuho[dialogIndex].text}</p>
                        <button
                          onClick={() => {
                            if (dialogIndex < dialogoConBuho.length - 1) {
                              setDialogIndex((prev) => prev + 1);
                            } else {
                              setHasTalkedToBuho(true); // Marcar que ya habló con el búho
                              setScene('choice'); 
                            }
                          }}
                        >
                          Siguiente
                        </button>
                      </div>
                    ) : (
                      <p>Cargando diálogo...</p>
                    )
                  ) : (
                    // Si el jugador ya habló con el búho pero no tiene las bellotas
                    <div className="dialogue-box">
                      <p className="dialogue-speaker">🦉 Búho:</p>
                      <p className="dialogue-text">Vuelve con las 3 bellotas y podremos jugar...</p>
                      <button onClick={() => setScene('choice')}>Volver</button>
                    </div>
                  )}
                </div>
              )}

              {scene === 'margaritas' && (
                <MargaritasScene
                  onFound={() => {
                    if (!foundAcorn1) {
                      setFoundAcorn1(true);
                      setCollectedAcorns((prev) => prev + 1);
                    }
                  }}
                  onBack={() => setScene('explore')}
                  blueEncontrado={blueEncontrado.margaritas}
                  marcarBlue={() => marcarBlueComoEncontrado('margaritas')}
                />
              )}

              {scene === 'raices' && (
                <AncientTreeScene
                  onFound={() => {
                    setFoundAcorn2(true);
                    setCollectedAcorns(prev => prev + 1);
                  }}
                  onBack={() => setScene('explore')}
                  blueEncontrado={blueEncontrado.ancientTree}
                  marcarBlue={() => marcarBlueComoEncontrado('ancientTree')}
                />
              )}

              {scene === 'talkWithBuho' && (
                <TalkWithBuho
                  onNextScene={() => setScene('game')}
                  setCurrentSong={setCurrentSong}
                  audioRef={audioRef}
                />
              )}

              {scene === 'game' && (
                <VerdadOSalto
                  onFinish={() => setScene('postGameTalk')}
                  blueEncontrado={blueEncontrado.verdadJuego}
                  marcarBlue={() => marcarBlueComoEncontrado('verdadJuego')}
                />
              )}

              {scene === 'postGameTalk' && (
                <PostGameTalk onNext={() => setScene('postGameEpilogue')} />
              )}

              {scene === 'postGameEpilogue' && (
                  <PostGameEpilogue onClose={() => setScene('nextScene')} 
                    audioRef={audioRef}                 
                  />
                                   
                )}



              {scene === 'song' && (
                <div className="scene">
                  <h2>Está sonando su canción favorita contigo 🎵</h2>
                  <audio ref={audioRef} controls>
                    <source src="/song.mp3" type="audio/mpeg" />
                    Tu navegador no soporta audio.
                  </audio>
                  <button onClick={() => setScene('start')}>Volver</button>
                </div>
              )}

              {scene === 'end' && (
                <div className="scene">
                  <h2>Gracias por estar aquí 💌</h2>
                  <p>Este es solo un pequeño regalo, pero viene con mucho cariño.</p>
                </div>
              )}
      </div>

      {showReminder && (
        <div className="overlay-reminder">
          <Typewriter
            text="Hmm... Tal vez debería hablar con ese búho antes de adentrarme al bosque. Parece saber más de lo que aparenta."
            onDone={() => setTimeout(() => setShowReminder(false), 4000)}
          />
        </div>
      )}

      {showReward && (
        <div className="reward-popup">
          <p>{poemaMailyn}</p>
          <button onClick={() => setShowReward(false)}>Cerrar</button>
        </div>
      )}
      <div 
        className="secret-trigger" 
        onClick={() => setSecret(true)} 
      />
    </div>
    </ConnectionProvider>
  );
}

export default App;
