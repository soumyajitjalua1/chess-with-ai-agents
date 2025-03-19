
import Layout from '../components/layout/Layout';
import { Trophy, ArrowUp, ArrowDown, User, Shield, Map } from 'lucide-react';

// Player row component
const PlayerRow = ({ 
  rank, 
  trend, 
  playerName, 
  playerImage, 
  elo, 
  streak, 
  isUser = false 
}: { 
  rank: number; 
  trend: 'up' | 'down' | 'neutral'; 
  playerName: string; 
  playerImage: string; 
  elo: number; 
  streak: number;
  isUser?: boolean;
}) => {
  const trendIcon = trend === 'up' 
    ? <ArrowUp size={16} className="text-green-400" /> 
    : trend === 'down' 
      ? <ArrowDown size={16} className="text-chess-red" /> 
      : null;
  
  return (
    <tr className={`border-b border-white/10 transition-colors ${isUser ? 'bg-chess-red/10' : 'hover:bg-white/5'}`}>
      <td className="py-4 pl-6">
        <div className="flex items-center">
          <div className="text-gray-400 font-medium mr-2">#{rank}</div>
          {trendIcon}
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img src={playerImage} alt={playerName} className="w-full h-full object-cover" />
          </div>
          <div className="font-medium text-white">{playerName}</div>
          {isUser && (
            <div className="ml-3 text-xs bg-chess-red/20 text-chess-red py-1 px-2 rounded">
              You
            </div>
          )}
        </div>
      </td>
      <td className="py-4 text-white font-mono">{elo}</td>
      <td className="py-4">
        <div className="flex items-center justify-center">
          <Shield size={16} className="text-orange-400 mr-1" />
          <span className="text-white">{streak}</span>
        </div>
      </td>
      <td className="py-4 pr-6">
        <button className="py-1 px-3 rounded bg-chess-red/90 text-white text-sm hover:bg-chess-red transition-colors">
          Challenge
        </button>
      </td>
    </tr>
  );
};

// AI Opponent card
const AIOpponentCard = ({ name, image, difficulty }: { name: string; image: string; difficulty: string }) => (
  <div className="flex items-center justify-between bg-chess-dark rounded-lg p-3 border border-white/10 hover:border-chess-blue/40 transition-all duration-200">
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-chess-blue/20 flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-white font-medium">{name}</div>
        <div className="text-gray-400 text-xs">{difficulty}</div>
      </div>
    </div>
    <button className="py-1 px-4 rounded bg-chess-blue text-white text-sm hover:bg-opacity-90 transition-colors">
      Battle
    </button>
  </div>
);

// Rising player card
const RisingPlayerCard = ({ name, image, gain }: { name: string; image: string; gain: string }) => (
  <div className="flex items-center justify-between bg-chess-dark rounded-lg p-3 border border-white/10">
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="text-white font-medium">{name}</div>
    </div>
    <div className="text-green-400 flex items-center">
      <ArrowUp size={14} className="mr-1" />
      {gain}
    </div>
  </div>
);

const Leaderboard = () => {
  // Mock data for players
  const topPlayers = [
    { rank: 1, trend: 'up', name: 'NeuralNinja', image: '/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png', elo: 2840, streak: 8 },
    { rank: 2, trend: 'down', name: 'QuantumQueen', image: '/lovable-uploads/f1b16569-5a77-4d1c-a2e4-41fcff062844.png', elo: 2795, streak: 5 },
    { rank: 3, trend: 'up', name: 'GrandMaster X', image: '/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png', elo: 2760, streak: 3, isUser: true },
    { rank: 4, trend: 'neutral', name: 'ChessWhiz99', image: '/lovable-uploads/f1b16569-5a77-4d1c-a2e4-41fcff062844.png', elo: 2710, streak: 0 },
    { rank: 5, trend: 'down', name: 'DeepThought', image: '/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png', elo: 2685, streak: 2 },
  ];
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="text-chess-red">AI</span> CHAMPIONS LEAGUE
            </h1>
            <p className="text-gray-400">
              The world's best chess players and AI opponents compete for glory.
            </p>
          </div>
          <button className="button-primary mt-4 md:mt-0 flex items-center">
            <Map size={18} className="mr-2" />
            My Rank
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main leaderboard - top players */}
          <div className="md:col-span-3">
            <div className="bg-chess-dark rounded-xl overflow-hidden">
              <div className="bg-chess-darker p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Global Rankings</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                    <th className="py-3 pl-6">RANK</th>
                    <th className="py-3">PLAYER</th>
                    <th className="py-3">ELO</th>
                    <th className="py-3 text-center">STREAK</th>
                    <th className="py-3 pr-6">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {topPlayers.map((player) => (
                    <PlayerRow 
                      key={player.rank}
                      rank={player.rank}
                      trend={player.trend as 'up' | 'down' | 'neutral'}
                      playerName={player.name}
                      playerImage={player.image}
                      elo={player.elo}
                      streak={player.streak}
                      isUser={player.isUser}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sidebar - rising players and top AI */}
          <div className="md:col-span-1 space-y-6">
            {/* Rising Players */}
            <div className="chess-card">
              <h3 className="text-white font-semibold mb-4">Rising Players</h3>
              <div className="space-y-3">
                <RisingPlayerCard 
                  name="SylvMaster" 
                  image="/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png" 
                  gain="+245" 
                />
                <RisingPlayerCard 
                  name="Alphabot" 
                  image="/lovable-uploads/f1b16569-5a77-4d1c-a2e4-41fcff062844.png" 
                  gain="+180" 
                />
              </div>
            </div>
            
            {/* Top AI Opponents */}
            <div className="chess-card">
              <h3 className="text-white font-semibold mb-4">Top AI Opponents</h3>
              <div className="space-y-3">
                <AIOpponentCard 
                  name="DeepMind Elite" 
                  image="/lovable-uploads/39866914-748b-4dea-90f0-7dd9fe5ef58a.png" 
                  difficulty="Grandmaster+" 
                />
                <AIOpponentCard 
                  name="Neural Master" 
                  image="/lovable-uploads/39866914-748b-4dea-90f0-7dd9fe5ef58a.png" 
                  difficulty="Advanced" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-16">
          © 2024 AI Champions League. All rights reserved.
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
