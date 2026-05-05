import React, { useState, useEffect } from 'react';
import './LoadingViewer.css';

const messages = [
  "Conectando ao Spotify...",
  "Que gosto musical, hein!",
  "Dando os toques finais...",
  "Só mais um pouquinho..."
];

function LoadingViewer() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => {
        // Se chegar na última frase, para nela e não volta pro começo
        if (prevIndex === messages.length - 1) return prevIndex;
        return prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval); // Limpeza de segurança
  }, []);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-title">surasic</h2>
      {/* A key força a animação do CSS a rodar novamente toda vez que o texto muda */}
      <p key={messageIndex} className="loading-text">
        {messages[messageIndex]}
      </p>
    </div>
  );
}

export default LoadingViewer;