
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const GameCard = ({ 
  title, 
  description, 
  image, 
  buttonText, 
  link 
}: { 
  title: string; 
  description: string; 
  image: string; 
  buttonText: string; 
  link: string;
}) => {
  return (
    <div className="chess-card overflow-hidden group">
      <div className="h-48 overflow-hidden rounded-lg mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-chess-dark to-transparent z-10"></div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Link to={link} className="inline-block button-ghost">
        {buttonText}
      </Link>
    </div>
  );
};

const GameModes = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Choose Your Battle
        </h2>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants}>
            <GameCard 
              title="Classic Chess" 
              description="Master the timeless game with our advanced AI opponents."
              image="/lovable-uploads/7a58b658-097a-4b6e-a817-ae66da473e41.png" 
              buttonText="Play Classic"
              link="/play/classic"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GameCard 
              title="AI Challenge" 
              description="Face off against our most powerful AI opponents with unique personalities."
              image="/lovable-uploads/8710a9d4-38d8-476c-8f50-507f86fdfbb2.png" 
              buttonText="Challenge AI"
              link="/play/ai-challenge"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GameCard 
              title="Multiplayer" 
              description="Compete against players from around the world in real-time matches."
              image="/lovable-uploads/f1b16569-5a77-4d1c-a2e4-41fcff062844.png" 
              buttonText="Find Match"
              link="/play/multiplayer"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameModes;
