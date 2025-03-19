
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Heart, Trophy, Users, Award, BarChart2, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock performance data
const performanceData = [
  { month: 'Jan', rating: 2150 },
  { month: 'Feb', rating: 2185 },
  { month: 'Mar', rating: 2160 },
  { month: 'Apr', rating: 2220 },
  { month: 'May', rating: 2275 },
  { month: 'Jun', rating: 2320 },
  { month: 'Jul', rating: 2280 },
];

// Stat Card Component
const StatCard = ({ icon, title, value, background }: { icon: React.ReactNode; title: string; value: string | number; background: string }) => (
  <div className={`chess-card ${background}`}>
    <div className="flex items-center mb-2">
      <div className="mr-2 opacity-70">{icon}</div>
      <span className="text-gray-400 text-sm">{title}</span>
    </div>
    <div className="text-white text-2xl font-bold">{value}</div>
  </div>
);

// Game History Item
const GameHistoryItem = ({ 
  opponent, 
  opening, 
  result, 
  time 
}: { 
  opponent: string; 
  opening: string; 
  result: 'Victory' | 'Defeat' | 'Draw'; 
  time: string;
}) => {
  const resultColor = result === 'Victory' 
    ? 'text-green-400' 
    : result === 'Defeat' 
      ? 'text-chess-red' 
      : 'text-gray-400';
  
  return (
    <div className="chess-card flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-chess-dark rounded-full flex items-center justify-center mr-3">
          <span className="text-chess-red">♟</span>
        </div>
        <div>
          <div className="text-white">vs. {opponent}</div>
          <div className="text-gray-400 text-sm">{opening}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${resultColor}`}>{result}</div>
        <div className="text-gray-500 text-xs">{time}</div>
      </div>
    </div>
  );
};

// Achievement Item
const AchievementItem = ({ 
  title, 
  description, 
  icon, 
  unlocked 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  unlocked: boolean;
}) => (
  <div className={`chess-card ${unlocked ? '' : 'opacity-50'}`}>
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
        unlocked ? 'bg-chess-red/20 text-chess-red' : 'bg-gray-800 text-gray-600'
      }`}>
        {icon}
      </div>
      <div>
        <div className="text-white">{title}</div>
        <div className="text-gray-400 text-sm">{description}</div>
      </div>
      {unlocked && (
        <div className="ml-auto">
          <div className="w-3 h-3 rounded-full bg-chess-red"></div>
        </div>
      )}
    </div>
  </div>
);

const PlayerProfile = () => {
  const [activeTab, setActiveTab] = useState('history');
  
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl py-16">
        {/* Profile Header */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-chess-darker"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-chess-red overflow-hidden mb-4 md:mb-0 md:mr-6">
              <img 
                src="/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white">GrandMaster X</h1>
              <div className="text-gray-400 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1">
                <span>Rating: 2850</span>
                <span className="hidden md:inline">|</span>
                <span>Rank #3 Global</span>
              </div>
              <div className="mt-2">
                <button className="button-primary inline-flex items-center text-sm py-1 px-3">
                  <Heart size={14} className="mr-1" />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard 
            icon={<Trophy size={20} />} 
            title="Win Rate" 
            value="89%" 
            background="bg-gradient-to-br from-chess-dark to-chess-red/20" 
          />
          <StatCard 
            icon={<Users size={20} />} 
            title="AI Battles Fought" 
            value="1,247" 
            background="bg-gradient-to-br from-chess-dark to-chess-blue/20" 
          />
          <StatCard 
            icon={<Award size={20} />} 
            title="Tactics Mastery" 
            value="Level 42" 
            background="bg-gradient-to-br from-chess-dark to-chess-purple/20" 
          />
          <StatCard 
            icon={<ChevronRight size={20} />} 
            title="Top Opening" 
            value="Sicilian" 
            background="bg-gradient-to-br from-chess-dark to-chess-red/20" 
          />
        </div>
        
        {/* Performance Timeline */}
        <div className="chess-card mb-10">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea384c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ea384c" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333' }} />
              <Area type="monotone" dataKey="rating" stroke="#ea384c" fillOpacity={1} fill="url(#colorRating)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Tabs: Game History, Achievements, Customization */}
        <Tabs defaultValue="history" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger 
              value="history" 
              className={activeTab === 'history' ? 'border-b-2 border-chess-red' : ''}
            >
              Game History
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className={activeTab === 'achievements' ? 'border-b-2 border-chess-red' : ''}
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger 
              value="customization" 
              className={activeTab === 'customization' ? 'border-b-2 border-chess-red' : ''}
            >
              Customization
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4">
            <GameHistoryItem 
              opponent="DeepMind Elite" 
              opening="Sicilian Defense" 
              result="Victory" 
              time="2h ago" 
            />
            <GameHistoryItem 
              opponent="AlphaZero" 
              opening="Queen's Gambit" 
              result="Defeat" 
              time="5h ago" 
            />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <AchievementItem 
              title="Grandmaster Status" 
              description="Reach a rating of 2500+" 
              icon={<Trophy size={18} />} 
              unlocked={true} 
            />
            <AchievementItem 
              title="AI Conqueror" 
              description="Defeat all AI opponents at least once" 
              icon={<Award size={18} />} 
              unlocked={true} 
            />
            <AchievementItem 
              title="Perfect Game" 
              description="Win a game with 100% move accuracy" 
              icon={<BarChart2 size={18} />} 
              unlocked={false} 
            />
          </TabsContent>
          
          <TabsContent value="customization" className="chess-card">
            <h3 className="text-xl font-semibold text-white mb-4">Profile Customization</h3>
            <p className="text-gray-400">
              Customize your profile appearance, privacy settings, and notification preferences.
            </p>
            <button className="button-ghost mt-4">
              Edit Preferences
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PlayerProfile;
