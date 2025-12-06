import React, { useRef, useState, useEffect } from 'react';
import './CardViewer.css';
import { darkenHexColor } from '../../utils/color';


// Componente principal que exibe o card da playlist
export default function CardViewer({ cardBase64, pageBase64, vibrantColor, playlistName }) {
  // Referência para acessar o elemento do card diretamente
  const cardRef = useRef(null);
  // Estado para controlar a posição do brilho
  const [shine, setShine] = useState({ x: 50, y: 50 });
  // Estado para saber se o mouse está sobre o card
  const [isHovering, setIsHovering] = useState(false);
  // Referência para guardar o intervalo da animação do brilho
  const shineIntervalRef = useRef(null);


  // Atualiza a cor vibrante global e garante limpeza do intervalo ao desmontar
  useEffect(() => {
    document.documentElement.style.setProperty('--vibrant-color', vibrantColor);
    return () => {
      // Limpa intervalos ao desmontar o componente
      if (shineIntervalRef.current) {
        clearInterval(shineIntervalRef.current);
        shineIntervalRef.current = null;
      }
    };
  }, [vibrantColor]);


  // Função chamada quando o mouse se move sobre o card
  const handleMouseMove = (e) => {
    // Ativa o estado de hover se ainda não estiver ativo
    if (!isHovering) setIsHovering(true);
    // Cancela qualquer animação de brilho que esteja rodando
    if (shineIntervalRef.current) {
      clearInterval(shineIntervalRef.current);
      shineIntervalRef.current = null;
    }
    // Pega as dimensões do card para calcular posição relativa do mouse
    const rect = cardRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    // Garante que x e y fiquem dentro dos limites do card
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calcula a rotação do card para efeito 3D
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 15;
    setCardTransform({ rotateX, rotateY });

    // Calcula a posição do brilho para acompanhar o mouse
    const targetX = 100 - (x / rect.width) * 100;
    const targetY = 100 - (y / rect.height) * 100;
    setShine(prev => ({
      x: prev.x + (targetX - prev.x) * 0.05,
      y: prev.y + (targetY - prev.y) * 0.05
    }));
  };


  // Estado para controlar a rotação do card
  const [cardTransform, setCardTransform] = useState({ rotateX: 0, rotateY: 0 });

  // Função chamada quando o mouse sai do card
  const handleMouseLeave = () => {
    setIsHovering(false); // Desativa o estado de hover
    setCardTransform({ rotateX: 0, rotateY: 0 }); // Retorna o card para posição central
    if (shineIntervalRef.current) clearInterval(shineIntervalRef.current);
    // Inicia animação suave para o brilho voltar ao centro
    shineIntervalRef.current = setInterval(() => {
      setShine(prev => {
        const dx = 50 - prev.x;
        const dy = 50 - prev.y;
        // Quando o brilho chega perto do centro, para a animação
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          clearInterval(shineIntervalRef.current);
          shineIntervalRef.current = null;
          return { x: 50, y: 50 };
        }
        // Move o brilho gradualmente para o centro
        return {
          x: prev.x + dx * 0.01,
          y: prev.y + dy * 0.01
        };
      });
    }, 16);
  };


  // Função para baixar a imagem da página da playlist
  const downloadCard = () => {
    const link = document.createElement('a'); // Cria um link temporário
    link.href = `data:image/png;base64,${pageBase64}`; // Define o conteúdo da imagem
    link.download = `${playlistName}_pagina.png`; // Define o nome do arquivo
    link.click(); // Simula o clique para baixar
  };


  // Renderiza o componente visual
  return (
    <div
      className="viewer-container"
      style={{
        backgroundColor: darkenHexColor(vibrantColor, 0.55), // Fundo escurecido
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="card-wrapper"
        onMouseMove={handleMouseMove} // Detecta movimento do mouse
        onMouseLeave={handleMouseLeave} // Detecta saída do mouse
      >
        <div
          className="card"
          ref={cardRef}
          style={{
            '--shine-x': `${shine.x}%`, // Posição do brilho X
            '--shine-y': `${shine.y}%`, // Posição do brilho Y
            '--shine-color': darkenHexColor(vibrantColor, -0.3), // Cor do brilho
            '--shine-opacity': isHovering ? 0.3 : 0.2, // Opacidade do brilho
            transform: `rotateX(${-cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg)`, // Rotação 3D
            transition: isHovering ? 'transform 0.3s ease-out' : 'transform 0.5s ease-in-out', // Animação suave
          }}
        >
          {/* Imagem do card da playlist */}
          <img src={`data:image/png;base64,${cardBase64}`} alt={playlistName} />
        </div>
      </div>
      <button
        className="download-btn"
        onClick={downloadCard} // Baixa a imagem ao clicar
        aria-label={`Baixar card da playlist ${playlistName}`}
      >
        Baixar Card
      </button>
    </div>
  );

}
