
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { 
  BarChart as BarChartIcon, 
  RefreshCcw, 
  Download, 
  Share2, 
  Clock, 
  Zap, 
  Award 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const performanceData = [
  { move: 1, accuracy: 65 },
  { move: 2, accuracy: 48 },
  { move: 3, accuracy: 92 },
  { move: 4, accuracy: 75 },
  { move: 5, accuracy: 53 },
  { move: 6, accuracy: 88 },
  { move: 7, accuracy: 97 },
];

// Game timeline component
const GameTimeline = () => {
  const keyMoves = [
    { move: 1, notation: "e4", quality: "+0.5", description: "Best Move" },
    { move: 2, notation: "Nf3", quality: "+0.3", description: "Solid Defense" }
  ];
  
  return (
    <div className="neo-blur rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Game Timeline</h3>
      <div className="space-y-4">
        {keyMoves.map((move) => (
          <div key={move.move} className="flex items-center bg-white/5 rounded-lg p-3">
            <div className="flex-shrink-0 w-6 mr-3 text-center text-gray-400">
              {move.move}.
            </div>
            <div className="flex-shrink-0 w-10 h-10 bg-chess-dark/60 rounded flex items-center justify-center mr-4">
              {move.notation.includes('N') ? (
                <span className="text-white">♞</span>
              ) : (
                <span className="text-white">♙</span>
              )}
            </div>
            <div className="flex-grow">
              <div className="text-white">{move.notation} <span className="text-chess-red">{move.quality}</span></div>
              <div className="text-gray-400 text-sm">{move.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10">
        <h4 className="text-white font-medium mb-3">Performance Analysis</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="move" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333' }} 
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="accuracy" fill="#ea384c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// AI Insights component
const AIInsights = () => {
  return (
    <div className="neo-blur rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">AI Insights</h3>
      
      <div className="mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
              <BarChartIcon size={18} className="text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-white text-sm">
              Excellent opening strategy! Your control of the center was particularly strong.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Consider developing your knights earlier in similar positions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Accuracy</span>
            <span className="text-green-400">92%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: "92%" }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Critical Moves</span>
            <span className="text-blue-400">8/10</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: "80%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Match Stats component
const MatchStats = () => {
  const stats = [
    { label: "Duration", value: "15:42" },
    { label: "Moves", value: "32" },
    { label: "Captures", value: "8" },
  ];
  
  return (
    <div className="neo-blur rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Match Stats</h3>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-center">
            <span className="text-gray-400">{stat.label}</span>
            <span className="text-white font-mono">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Action buttons component
const ActionButtons = () => {
  const actions = [
    { icon: <RefreshCcw size={18} />, label: "Rematch", color: "text-green-400 bg-green-900/20" },
    { icon: <Download size={18} />, label: "Save Game", color: "text-gray-200 bg-gray-700/30" },
    { icon: <Share2 size={18} />, label: "Share Replay", color: "text-gray-200 bg-gray-700/30" },
  ];
  
  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg ${action.color} transition-transform duration-200 hover:scale-[1.02]`}
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

const GameAnalysis = () => {
  const [result] = useState("Victory");

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-chess-red mb-2">Game Over</h1>
          <div className={`text-2xl font-medium ${
            result === "Victory" ? "text-green-400" : "text-chess-red"
          }`}>
            {result}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column - AI Insights */}
          <div className="md:col-span-4">
            <AIInsights />
          </div>
          
          {/* Middle column - Game Timeline */}
          <div className="md:col-span-5">
            <GameTimeline />
          </div>
          
          {/* Right column - Actions and Stats */}
          <div className="md:col-span-3 space-y-6">
            <ActionButtons />
            <MatchStats />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameAnalysis;
