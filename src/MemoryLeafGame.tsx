import { useState, useRef } from 'react';

function MemoryLeafGame({ onFound }) {
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [done, setDone] = useState(false);

  const leaves = ['🍁','🍃','🍂','🍁','🍃','🍂']; // pares
  const shuffled = useRef([...leaves].sort(() => Math.random() - 0.5));

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (shuffled.current[i1] === shuffled.current[i2]) {
        setMatched(prev => [...prev, i1, i2]);
        setFlipped([]);
        if (matched.length + 2 === shuffled.current.length) {
          setTimeout(() => {
            setDone(true);
            onFound();
          }, 600);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <>
      <div className="leaf-grid">
        {shuffled.current.map((leaf, i) => (
          <button 
            key={i}
            className={`leaf-card ${flipped.includes(i) || matched.includes(i) ? 'flipped' : ''}`}
            onClick={() => handleFlip(i)}
          >
            {(flipped.includes(i) || matched.includes(i)) ? leaf : '❔'}
          </button>
        ))}
      </div>
      {done && (
        <div className="bellota-final">
          🌰 ¡La bellota estaba escondida bajo la última hoja!
        </div>
      )}
    </>
  );
}

export default MemoryLeafGame;
