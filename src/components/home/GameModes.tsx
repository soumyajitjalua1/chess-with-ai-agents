
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
              image="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000058044/2139d52186b7961ba59e29c7cd047dbd7a564d0988d5b373cf722dd076126a6f" 
              buttonText="Play Classic"
              link="/Playclassic"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GameCard 
              title="AI Challenge" 
              description="Face off against our most powerful AI opponents with unique personalities."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVr4PSvLgMxUNauhDZ1wdHbSRoYZPnsWZBpA&s" 
              buttonText="Challenge AI"
              link="/play-ai-challenge"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GameCard 
              title="Multiplayer" 
              description="Compete against players from around the world in real-time matches."
              image="https://images.crazygames.com/chess-online-multiplayer-game_16x9/20241008073624/chess-online-multiplayer-game_16x9-cover?auto=format,compress&q=75&cs=strip" 
              buttonText="Find Match"
              link="/multiplayer"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameModes;
