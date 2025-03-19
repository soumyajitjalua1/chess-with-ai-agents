
import { Link } from 'react-router-dom';
import { PlayCircle, BookOpen, TrendingUp } from 'lucide-react';

const ActionButton = ({ 
  icon, 
  text, 
  to, 
  variant 
}: { 
  icon: React.ReactNode; 
  text: string; 
  to: string; 
  variant: 'primary' | 'secondary' | 'purple';
}) => {
  const buttonClass = variant === 'primary' 
    ? 'button-primary' 
    : variant === 'secondary' 
      ? 'button-secondary' 
      : 'button-purple';
  
  return (
    <Link to={to} className={`${buttonClass} flex items-center justify-center gap-2 w-full sm:w-auto`}>
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const CallToAction = () => {
  return (
    <section className="py-16 bg-chess-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ActionButton 
            icon={<PlayCircle size={20} />} 
            text="Start Game" 
            to="/play" 
            variant="primary"
          />
          <ActionButton 
            icon={<BookOpen size={20} />} 
            text="Learn Strategies" 
            to="/learn" 
            variant="secondary"
          />
          <ActionButton 
            icon={<TrendingUp size={20} />} 
            text="View Leaderboard" 
            to="/leaderboard" 
            variant="purple"
          />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
