import './HeroBadge.css'

export default function HeroBadge() {
  const handleBadgeMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--badge-x', `${x}px`);
    e.currentTarget.style.setProperty('--badge-y', `${y}px`);
  };

  return (
    <div className="badge" onMouseMove={handleBadgeMouseMove}>
      <span>⭐ TRANSFORME SUA PLAYLIST</span>
    </div>
  );
}