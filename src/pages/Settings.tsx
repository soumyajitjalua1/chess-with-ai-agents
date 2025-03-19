
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Settings = () => {
  const [aiDifficulty, setAiDifficulty] = useState(50);
  const [boardStyle, setBoardStyle] = useState('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  
  const avatars = [
    '/lovable-uploads/090eeb9d-c437-4e03-a7ea-b4561ecb106a.png',
    '/lovable-uploads/39866914-748b-4dea-90f0-7dd9fe5ef58a.png',
    '/lovable-uploads/32b6e06b-2b4b-49f6-83f9-f2ef2c26d97d.png',
    '/lovable-uploads/f1b16569-5a77-4d1c-a2e4-41fcff062844.png',
  ];
  
  const getDifficultyLabel = (value: number) => {
    if (value < 25) return 'Beginner';
    if (value < 50) return 'Intermediate';
    if (value < 75) return 'Advanced';
    return 'Grandmaster';
  };
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };
  
  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
          Game Settings
        </h1>
        
        <div className="space-y-8">
          {/* AI Difficulty */}
          <div className="chess-card">
            <h2 className="text-xl font-semibold text-white mb-6">AI Difficulty</h2>
            <div className="space-y-6">
              <Slider
                value={[aiDifficulty]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => setAiDifficulty(values[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Beginner</span>
                <span className="text-white font-medium">
                  {getDifficultyLabel(aiDifficulty)}
                </span>
                <span>Grandmaster</span>
              </div>
            </div>
          </div>
          
          {/* Board Style */}
          <div className="chess-card">
            <h2 className="text-xl font-semibold text-white mb-6">Board Style</h2>
            <div className="grid grid-cols-3 gap-4">
              {['classic', 'futuristic', 'dark-mode'].map((style) => (
                <div 
                  key={style}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    boardStyle === style 
                      ? 'border-chess-red' 
                      : 'border-transparent hover:border-white/20'
                  }`}
                  onClick={() => setBoardStyle(style)}
                >
                  <input
                    type="radio"
                    name="boardStyle"
                    id={style}
                    value={style}
                    checked={boardStyle === style}
                    onChange={() => setBoardStyle(style)}
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={style}
                    className="cursor-pointer flex flex-col items-center p-4"
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2">
                      {boardStyle === style && <div className="w-3 h-3 rounded-full bg-chess-red"></div>}
                    </div>
                    <span className="capitalize text-sm">
                      {style.replace('-', ' ')}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Game Sound Effects */}
          <div className="chess-card">
            <h2 className="text-xl font-semibold text-white mb-6">Game Sound Effects</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-toggle">Enable Sound Effects</Label>
              <Switch 
                id="sound-toggle" 
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </div>
          
          {/* Player Avatar Selection */}
          <div className="chess-card">
            <h2 className="text-xl font-semibold text-white mb-6">Player Avatar Selection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {avatars.map((avatar, index) => (
                <div 
                  key={index}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    selectedAvatar === index 
                      ? 'border-chess-red neon-red' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="text-center">
            <Button 
              onClick={handleSaveSettings}
              className="px-8 py-6 bg-chess-red hover:bg-chess-red/90 text-white font-semibold rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,56,76,0.5)]"
            >
              Save & Apply
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
