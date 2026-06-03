import './FloatingCards.css'
import red from '../../assets/card1.webp';
import blue from '../../assets/card2.webp';
import pink from '../../assets/card3.webp';
import green from '../../assets/card4.webp';
import purple from '../../assets/card5.webp';
import darkBlue from '../../assets/card6.webp';
import darkRed from '../../assets/card7.webp';
import aqua from '../../assets/card8.webp';

export default function FloatingCards() {
  return (
    <div className="cards-wrapper">
      {/* CARDS NA ESQUERDA */}
      <img src={aqua} className="card aqua" alt="Playlist cover layout 8" />
      <img src={purple} className="card purple" alt="Playlist cover layout 5" />
      <img src={blue} className="card blue" alt="Playlist cover layout 2" />
      <img src={red} className="card red" alt="Playlist cover layout 1" />

      {/* CARDS NA DIREITA */}
      <img src={darkRed} className="card darkRed" alt="Playlist cover layout 7" />
      <img src={green} className="card green" alt="Playlist cover layout 4" />
      <img src={pink} className="card pink" alt="Playlist cover layout 3" />
      <img src={darkBlue} className="card darkBlue" alt="Playlist cover layout 6" />
    </div>
  );
}