
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      
      const xPos = clientX / width - 0.5;
      const yPos = clientY / height - 0.5;
      
      const moveX = xPos * 20;
      const moveY = yPos * 20;
      
      heroRef.current.style.backgroundPosition = `${50 + moveX * 0.5}% ${50 + moveY * 0.5}%`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-200 ease-out"
      style={{ 
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(/lovable-uploads/db66e2eb-9d4d-4416-9cf0-0736c9731b1e.png)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-chess-darker"></div>
      
      <div className="container mx-auto px-4 z-10 max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-white tracking-tight text-shadow">
            <span className="text-chess-red">AI</span> CHESS <span className="text-chess-red">ARENA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            Challenge the most advanced AI opponents or face players worldwide in our futuristic chess battleground.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/play" className="button-primary group">
            Start Playing Now
            <ChevronRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" size={18} />
          </Link>
          <Link to="/watch" className="button-ghost">
            Watch Matches
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
