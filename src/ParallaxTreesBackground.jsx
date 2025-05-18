// ParallaxForestBackground.jsx
import './ParallaxForest.css';

function ParallaxForestBackground() {
  return (
    <div className="forest-background">
      <div className="layer back"></div>
      <div className="layer middle"></div>
      <div className="layer front"></div>
      <div className="layer lights"></div>
      <div className="layer ground"></div>
    </div>
  );
}

export default ParallaxForestBackground;