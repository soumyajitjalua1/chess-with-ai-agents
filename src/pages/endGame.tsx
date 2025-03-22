import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const tactics = [
    {
      name: "Lucena Position",
      fen: "4k3/8/8/8/4P3/8/1R6/1K2r3 w - - 0 1",
      moves: ["b2b4", "e1e3", "b4b3"],
      explanation: "The classic Lucena position where White builds a 'bridge' with the rook to shield the king from checks, allowing promotion of the pawn. The key technique is creating a shield with your rook on the 4th rank.",
      difficulty: 3
    },
    {
      name: "Philidor Position",
      fen: "6k1/8/8/8/3r4/8/3R4/3K4 w - - 0 1",
      moves: ["d2d3", "d4d8", "d3d7"],
      explanation: "The Philidor position is a drawing technique where the defending side keeps their rook on the 3rd rank until the opponent's king advances, then switches to giving checks from behind.",
      difficulty: 3
    },
    {
      name: "Opposition",
      fen: "8/8/8/3k4/8/8/8/3K4 w - - 0 1",
      moves: ["d1e2", "d5e5", "e2f3"],
      explanation: "The direct opposition principle. By moving to e2, White forces Black to give way. When kings face each other with an odd number of squares between them, the side to move is at a disadvantage.",
      difficulty: 1
    },
    {
      name: "Triangulation",
      fen: "8/8/8/4k3/8/4K3/8/8 w - - 0 1",
      moves: ["e3f3", "e5f5", "f3e3"],
      explanation: "Triangulation is a maneuver where one king makes a triangle-shaped path to lose a tempo and force the opponent's king to move, transferring the opposition advantage.",
      difficulty: 2
    },
    {
      name: "Zugzwang Endgame",
      fen: "8/8/p7/1p6/1P1k4/P7/8/4K3 w - - 0 1",
      moves: ["e1d2", "d4e4", "d2c3"],
      explanation: "A zugzwang position where any move Black makes worsens their position. White's king penetrates by approaching critical squares that control Black's pawn advances.",
      difficulty: 4
    },
    {
      name: "Reti's Idea",
      fen: "8/8/8/1K6/8/8/R7/5k2 w - - 0 1",
      moves: ["b5c4", "f1e1", "a2a1"],
      explanation: "A subtle endgame technique where White's king approaches diagonally to attack the opponent's king while simultaneously threatening to support the rook for checkmate.",
      difficulty: 3
    },
    {
      name: "Queen vs. Pawn",
      fen: "8/8/8/8/8/8/2p5/2K1Q3 w - - 0 1",
      moves: ["e1c2", "c2c1", "c2d3"],
      explanation: "A precise technique to prevent pawn promotion. The queen cuts off the king and controls the promotion square. When Black's pawn promotes, White immediately captures the new queen.",
      difficulty: 2
    },
    {
      name: "King and Pawn Breakthrough",
      fen: "4k3/8/3K4/2P5/8/8/8/8 w - - 0 1",
      moves: ["d6e6", "e8d8", "c5c6"],
      explanation: "The key breakthrough technique where White's king forces Black's king away from the defense of critical squares, allowing the pawn to advance and eventually promote.",
      difficulty: 2
    },
    {
      name: "Knight and Bishop Mate",
      fen: "k7/8/1K6/8/5N2/8/6B1/8 w - - 0 1",
      moves: ["g2c6", "a8b8", "f4d5"],
      explanation: "The famous technique for checkmating with knight and bishop. The key is to force the opponent's king to the corner matching your bishop's color, then coordinate the pieces for checkmate.",
      difficulty: 5
    },
    {
      name: "Pawn Race",
      fen: "8/p7/8/8/8/8/P1k5/4K3 w - - 0 1",
      moves: ["a2a4", "c2b2", "a4a5"],
      explanation: "A critical pawn race position where timing is everything. White pushes their pawn while maneuvering the king to stop Black's pawn. The key is calculating who will queen first and with what consequences.",
      difficulty: 3
    }
];

const EndgameChallenges = () => {
    const [game, setGame] = useState(new Chess());
    const [selectedTactic, setSelectedTactic] = useState(tactics[0]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState({});
  
    useEffect(() => {
      const savedProgress = JSON.parse(localStorage.getItem('tacticsProgress') || '{}');
      setProgress(savedProgress);
    }, []);
  
    useEffect(() => {
      if (isAnimating) {
        const timer = setInterval(() => {
          if (currentMoveIndex < selectedTactic.moves.length) {
            handleNext();
          } else {
            setIsAnimating(false);
          }
        }, 2000); // Increased animation duration
        return () => clearInterval(timer);
      }
    }, [isAnimating, currentMoveIndex]);
  
    const loadTactic = (tactic) => {
      setSelectedTactic(tactic);
      setCurrentMoveIndex(0);
      setIsAnimating(false); // Stop animation when changing tactic
      const newGame = new Chess(tactic.fen);
      setGame(newGame);
    };
  
    const makeMove = (index) => {
      const newGame = new Chess(selectedTactic.fen);
      for (let i = 0; i < index; i++) {
        newGame.move(selectedTactic.moves[i]);
      }
      setGame(newGame);
      setCurrentMoveIndex(index);
      
      const newProgress = {
        ...progress,
        [selectedTactic.name]: (index / selectedTactic.moves.length) * 100
      };
      setProgress(newProgress);
      localStorage.setItem('tacticsProgress', JSON.stringify(newProgress));
    };

  const handleStart = () => makeMove(0);
  const handlePrev = () => makeMove(Math.max(0, currentMoveIndex - 1));
  const handleNext = () => makeMove(Math.min(selectedTactic.moves.length, currentMoveIndex + 1));
  const toggleAnimation = () => setIsAnimating(!isAnimating);



  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
        <header className="mb-6">
            <div className="flex items-center">
                <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white">
                    <ChevronRight size={20} className="rotate-180 mr-1" />
                    <span>Back to Home</span>
                </Link>
                <div className="flex-1 text-center">
                    <h1 className="text-5xl font-bold text-red-600 mb-2">
                        Master Chess Tactics
                    </h1>
                    <p className="text-sm lg:text-base text-gray-400">
                        Click on any tactic below to see it demonstrated
                    </p>
                </div>
                <div className="w-[100px]"></div> 
            </div>
        </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tactics Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {tactics.map((tactic) => (
              <div
                key={tactic.name}
                onClick={() => loadTactic(tactic)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTactic.name === tactic.name 
                    ? 'bg-red-600/20 border-2 border-red-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <h3 className="text-lg font-bold text-red-500 mb-1">{tactic.name}</h3>
                <p className="text-sm text-gray-300">{tactic.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chessboard Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-red-500 mb-2">{selectedTactic.name}</h2>
              <p className="text-sm text-gray-300">{selectedTactic.explanation}</p>
            </div>


            <div className="relative h-[400px] w-[400px] mb-4 mx-auto">  {/* Added mx-auto */}
            <Chessboard
                position={game.fen()}
                boardWidth={400}
                customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                height: '400px',
                width: '100%'
                }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
            />
            </div>

            {/* Vertical Buttons */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={handleStart}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={toggleAnimation}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm transition-colors"
                >
                  {isAnimating ? 'Stop' : 'Play'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={handlePrev}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 p-3 rounded-lg">
              <div className="flex flex-wrap gap-1">
                {selectedTactic.moves.map((move, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded ${
                      index < currentMoveIndex 
                        ? 'bg-red-600/50 text-white'
                        : index === currentMoveIndex
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
            <h2 className="text-lg font-bold text-red-500 mb-3">Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tactics.map((tactic) => (
                <div key={tactic.name} className="bg-gray-700 p-2 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-300">{tactic.name}</span>
                    <span className="text-xs text-red-500">
                      {Math.round(progress[tactic.name] || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-red-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress[tactic.name] || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndgameChallenges;