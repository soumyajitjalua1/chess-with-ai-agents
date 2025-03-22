import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { BookOpen, Lightbulb, Target, Dices, Clock, ChevronRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router-dom';


// Learning card component
const LearningCard = ({ 
  title, 
  description, 
  image, 
  buttonText, 
  buttonColor,
  link 
}: { 
  title: string; 
  description: string; 
  image: string; 
  buttonText: string; 
  buttonColor: string;
  link: string;
}) => {
  const buttonClass = buttonColor === 'red' 
    ? 'button-primary' 
    : buttonColor === 'blue' 
      ? 'button-secondary' 
      : 'button-purple';
  
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
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Link to={link} className={`${buttonClass} w-full flex items-center justify-center`}>
        <span>{buttonText}</span>
        <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

// Slider control component
const ControlSlider = ({ 
  label, 
  value, 
  leftText, 
  rightText, 
  onChange 
}: { 
  label: string; 
  value: number; 
  leftText: string; 
  rightText: string; 
  onChange: (value: number[]) => void;
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white">{label}</label>
        <span className="text-chess-blue text-sm">{rightText}</span>
      </div>
      <Slider 
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={onChange}
        className="py-1"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{leftText}</span>
        <span>{rightText}</span>
      </div>
    </div>
  );
};

const LearningHub = () => {
  const [difficultyLevel, setDifficultyLevel] = useState(75);
  const [challengeType, setChallengeType] = useState(60);
  const [timeControl, setTimeControl] = useState(50);
  
  return (
    <Layout>
      <div 
        className="relative py-20 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(/lovable-uploads/db66e2eb-9d4d-4416-9cf0-0736c9731b1e.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-chess-darker"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          {/* <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
            <ChevronRight size={20} className="rotate-180 mr-1" />
            <span>Back to Home</span>
          </Link> */}

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-chess-blue mb-2">
              AI Chess Master
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Train with the future of chess intelligence
            </p>
          </div>
          
          <div className="glass-morphism max-w-3xl mx-auto p-4 rounded-lg mb-16">
            <div className="flex items-start">
              <div className="mr-3 bg-blue-900/20 p-2 rounded-full">
                <Lightbulb size={20} className="text-blue-400" />
              </div>
              <div className="text-white text-sm">
                <span className="font-medium">AI Mentor Tip:</span> Focus on pattern recognition in your tactical training today.
              </div>
            </div>
          </div>
          
          {/* Learning cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <LearningCard 
              title="Tactics Drills" 
              description="Master tactical patterns with AI-curated puzzles."
              image="https://media.istockphoto.com/id/511117530/photo/hand-moving-the-king-in-chess-game.jpg?s=2048x2048&w=is&k=20&c=dURR-7NCapVMb5rPE_2xydeWGGA8OWj75KGenta2FaE=" 
              buttonText="Train Now" 
              link="/tactics-drills"
              buttonColor="blue"
            />
            <LearningCard 
              title="AI Opening Trainer" 
              description="Learn dynamic opening systems against AI opponents."
              image="/lovable-uploads/7a58b658-097a-4b6e-a817-ae66da473e41.png" 
              buttonText="Train Now" 
              buttonColor="purple"
              link="/ai-learn"
            />
            <LearningCard 
              title="Endgame Challenges" 
              description="Perfect your endgame techniques with AI guidance."
              image="https://www.shutterstock.com/image-photo/checkmate-mans-hand-hitting-king-600nw-1807633336.jpg" 
              buttonText="Train Now" 
              buttonColor="red"
              link="/endgame-challenges"
            />
          </div>
          
          {/* Training controls */}
          <div className="chess-card max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-6">Training Controls</h3>
            
            <ControlSlider 
              label="Difficulty Level" 
              value={difficultyLevel} 
              leftText="Beginner" 
              rightText="Advanced" 
              onChange={(values) => setDifficultyLevel(values[0])}
            />
            
            <ControlSlider 
              label="Challenge Type" 
              value={challengeType} 
              leftText="Positional" 
              rightText="Tactical" 
              onChange={(values) => setChallengeType(values[0])}
            />
            
            <ControlSlider 
              label="Time Control" 
              value={timeControl} 
              leftText="Unlimited" 
              rightText="5 minutes" 
              onChange={(values) => setTimeControl(values[0])}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearningHub;
