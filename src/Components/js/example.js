import React, { useRef, useMemo, useEffect, useState } from "react";

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;

const ZoomImage = ({ image }) => {
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const observer = useRef(null);
  const background = useMemo(() => new Image(), [image]);

  // This function returns the number between min and max values.
  // For example clamp(3,5,7) wil lreturn 5
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const handleWheel = (event) => {
    const { deltaY } = event;
    setZoom((zoom) =>
      clamp(zoom + deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
    );
  };

  const draw = () => {
    if (canvasRef.current) {
      const { width, height } = background;
      const context = canvasRef.current.getContext("2d");

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear canvas and scale it based on current zoom
      context.clearRect(0, 0, width, height);
      context.scale(zoom, zoom);

      // Draw image
      context.drawImage(background, 0, 0);
    }
  };

  useEffect(() => {
    draw();
  }, [zoom]);

  return (
    <div ref={containerRef}>
      <canvas onWheel={handleWheel} ref={canvasRef} />
    </div>
  );
};

export default ZoomImage;
