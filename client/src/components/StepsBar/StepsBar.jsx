import './StepsBar.css'

export default function StepsBar() {
  const handleStepsMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--steps-x', `${x}px`);
    e.currentTarget.style.setProperty('--steps-y', `${y}px`);
  };

  return (
    <div className="steps-bar" onMouseMove={handleStepsMouseMove}>
      <div className="step-item">
        <div className="step-icon-wrapper step-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <div className="step-text">
          <h3>1. COLE O LINK</h3>
          <p>Cole o link da sua playlist do Spotify.</p>
        </div>
      </div>

      <div className="step-item">
        <div className="step-icon-wrapper step-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
        </div>
        <div className="step-text">
          <h3>2. PERSONALIZE</h3>
          <p>Escolha cores, estilo, layout e vibe.</p>
        </div>
      </div>

      <div className="step-item">
        <div className="step-icon-wrapper step-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <div className="step-text">
          <h3>3. BAIXE E COMPARTILHE</h3>
          <p>Baixe em alta resolução e compartilhe sua vibe!</p>
        </div>
      </div>
    </div>
  );
}