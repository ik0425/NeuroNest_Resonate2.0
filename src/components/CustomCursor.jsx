import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 bg-sage rounded-full z-[9999] transform -translate-x-1/2 -translate-y-1/2 hidden lg:block" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
      <div 
        className="pointer-events-none fixed top-0 left-0 w-6 h-6 bg-sage opacity-30 rounded-full z-[9998] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[80ms] hidden lg:block" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
    </>
  );
}
