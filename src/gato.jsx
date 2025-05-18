// GatoBlue.jsx
import React from 'react';
import './gato.css';

export default function GatoBlue({ top = '50%', left = '50%', scale = 1, onClick }) {
  return (
    <div
      className="gato-correr"
      style={{
        position: 'absolute',
        top,
        left,
        transform: `scale(${scale})`,
        zIndex: 5,
        cursor: 'pointer',
      }}
      onClick={onClick}
      title="¿Blue... eres tú?"
    ></div>
  );
}