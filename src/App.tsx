
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import GameInterface from "./pages/GameInterface";
import Settings from "./pages/Settings";
import GameAnalysis from "./pages/GameAnalysis";
import PlayerProfile from "./pages/PlayerProfile";
import Leaderboard from "./pages/Leaderboard";
import LearningHub from "./pages/LearningHub";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import Classical from "./pages/Classical";
import AIChessChallenge from "./pages/aiAgents";
import Multiplayer from "./pages/multiplayer";
import TacticsDrills from "./pages/TacticsDrills";
import EndgameChallenges from "./pages/endGame";
import AiLearn from "./pages/AiLearn";
import UnderConstructionPage from "./pages/UnderConstructionPage";
// Create a QueryClient instance
const queryClient = new QueryClient();

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Animated route component
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <AnimatedRoute>
                <Index />
              </AnimatedRoute>
            } />
            <Route path="/play" element={
              <AnimatedRoute>
                <GameInterface />
              </AnimatedRoute>
            } />
            <Route path="/Playclassic" element={
              <AnimatedRoute>
                <Classical />
              </AnimatedRoute>
            } />
            <Route path="/play-ai-challenge" element={
              <AnimatedRoute>
                <AIChessChallenge />
              </AnimatedRoute>
            } />
            <Route path="/multiplayer" element={
              <AnimatedRoute>
                <Multiplayer />
              </AnimatedRoute>
            } />
            <Route path="/ai-learn" element={
              <AnimatedRoute>
                <AiLearn />
              </AnimatedRoute>
            } />
            <Route path="/tactics-drills" element={
              <AnimatedRoute>
                <TacticsDrills />
              </AnimatedRoute>
            } />
            <Route path="/endgame-challenges" element={
              <AnimatedRoute>
                <EndgameChallenges />
              </AnimatedRoute>
            } />
            <Route path="/settings" element={
              <AnimatedRoute>
                <Settings />
              </AnimatedRoute>
            } />
            <Route path="/games" element={
              <AnimatedRoute>
                <Game />
              </AnimatedRoute>
            } />
            <Route path="/analysis" element={
              <AnimatedRoute>
                <GameAnalysis />
              </AnimatedRoute>
            } />
            <Route path="/profile" element={
              <AnimatedRoute>
                <PlayerProfile />
              </AnimatedRoute>
            } />
            <Route path="/leaderboard" element={
              <AnimatedRoute>
                <Leaderboard />
              </AnimatedRoute>
            } />
            <Route path="/learn" element={
              <AnimatedRoute>
                <LearningHub />
              </AnimatedRoute>
            } />
            <Route path="*" element={<UnderConstructionPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
