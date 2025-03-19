
import { useState } from 'react';
import { Layout } from '../components/layout';
import { Clock, Lightbulb, RotateCcw, BarChart3 } from 'lucide-react';

// Game components
const Timer = ({ time, label, isAI = false }: { time: string; label: string; isAI?: boolean }) => {
  return (
    <div className={`p-4 rounded-lg ${isAI ? 'bg-chess-red/20' : 'bg-blue-900/20'}`}>
      <div className="text-2xl font-mono font-bold">{time}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
};

const AIAvatar = () => {
  return (
    <div className="relative">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-2 border-2 border-chess-red/50 glow">
        <img 
          src="/lovable-uploads/39866914-748b-4dea-90f0-7dd9fe5ef58a.png" 
          alt="AI Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-white font-bold text-xl">NeoMind AI</div>
      <div className="text-chess-red text-sm">Grandmaster Level</div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, variant }: { icon: React.ReactNode; label: string; onClick: () => void; variant: string }) => {
  const colorClasses = {
    blue: "bg-blue-900/20 hover:bg-blue-900/30 text-blue-400",
    red: "bg-red-900/20 hover:bg-red-900/30 text-red-400",
    green: "bg-green-900/20 hover:bg-green-900/30 text-green-400",
  };
  
  const buttonClass = colorClasses[variant as keyof typeof colorClasses] || colorClasses.blue;
  
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-start w-full p-4 rounded-lg ${buttonClass} transition-colors duration-200`}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </button>
  );
};

const MoveHistory = () => {
  const moves = [
    { number: 1, white: "e4", black: "e5" },
    { number: 2, white: "Nf3", black: "Nc6" },
    { number: 3, white: "Bb5", black: "a6" },
  ];
  
  return (
    <div className="glass-morphism rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock size={16} /> Move History
      </h3>
      <div className="space-y-2">
        {moves.map((move) => (
          <div key={move.number} className="flex items-center justify-between text-sm">
            <div className="w-8 text-gray-500">{move.number}.</div>
            <div className="w-16 text-gray-300">{move.white}</div>
            <div className="w-16 text-gray-300">{move.black}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayerInfo = () => {
  return (
    <div className="flex items-center glass-morphism rounded-lg p-4">
      <div className="flex-shrink-0 mr-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-blue-500/30">
          <img 
            src="/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png" 
            alt="Player" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="text-white font-bold">Alexander Magnus</div>
        <div className="text-gray-400 text-sm">Rating: 2150</div>
      </div>
      <div className="flex-shrink-0 ml-4 w-64">
        <div className="text-xs text-gray-400 mb-1">Game Intensity</div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-chess-red" 
            style={{ width: "65%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Chessboard = () => {
  return (
    <div className="relative">
      <div className="neon-red rounded-lg overflow-hidden">
        <img 
          src="/lovable-uploads/32b6e06b-2b4b-49f6-83f9-f2ef2c26d97d.png" 
          alt="Chessboard" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

const GameInterface = () => {
  const [showHints, setShowHints] = useState(false);
  
  return (
    <Layout>
      <div className="container mx-auto pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar - AI and controls */}
          <div className="md:col-span-3 space-y-6">
            <div className="glass-morphism rounded-lg p-4 flex flex-col items-center">
              <Timer time="08:32" label="AI" isAI={true} />
              <div className="my-6">
                <AIAvatar />
              </div>
              
              <div className="w-full space-y-3 mt-4">
                <ActionButton 
                  icon={<Lightbulb size={18} />} 
                  label="Request Hint" 
                  onClick={() => setShowHints(!showHints)} 
                  variant="blue"
                />
                <ActionButton 
                  icon={<RotateCcw size={18} />} 
                  label="Undo Move" 
                  onClick={() => console.log("Undo move")} 
                  variant="red"
                />
                <ActionButton 
                  icon={<BarChart3 size={18} />} 
                  label="Analyze Position" 
                  onClick={() => console.log("Analyze")} 
                  variant="green"
                />
              </div>
            </div>
          </div>
          
          {/* Center - Chessboard */}
          <div className="md:col-span-6">
            <Chessboard />
          </div>
          
          {/* Right sidebar - Move history */}
          <div className="md:col-span-3 space-y-6">
            <Timer time="12:45" label="Player" />
            <MoveHistory />
          </div>
          
          {/* Bottom - Player info */}
          <div className="md:col-span-12">
            <PlayerInfo />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameInterface;
