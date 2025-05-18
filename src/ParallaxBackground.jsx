import './Parallax.css';

function ParallaxBackground() {
  return (
    <div className="parallax-container">
      <div className="layer bg" />
      <div className="layer far-mountains" />
      <div className="layer mid-mountains" />
      <div className="layer trees" />
      <div className="layer foreground-trees" />
    </div>
  );
}

export default ParallaxBackground;
