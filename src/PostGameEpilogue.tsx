import './PostGameEpilogue.css'


export default function PostGameEpilogue({ onClose }) {

    
    
  return (
    <div className="postgame-background epilogue-background">
      <div className="epilogue-container">
        <p className="epilogue-text">
          "En esta noche, entre saltos y silencios,<br/>
          el búho guardó en su memoria el brillo de la ardilla.<br/>
          No siempre hay certezas en el bosque,<br/>
          pero hay encuentros que dejan huella sin prometer regreso.<br/>
          Mailyn, gracias por los momentos compartidos,<br/>
          por las risas, por las pausas, por estar.<br/>
          Que este nuevo año te encuentre feliz, libre y rodeada de luz.<br/>
          — 🦉 Hasta donde el viento nos cruce otra vez."
        </p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
