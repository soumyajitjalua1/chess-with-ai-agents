import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const tactics = [
    {
        name: "Fork",
        description: "Use a single piece to attack two or more opponent pieces simultaneously, forcing them to choose which piece to save.",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 1",
        moves: ["d2d4", "f6e4", "c3e4", "d7d5", "e4c5", "d8d7", "c5e6"],
        explanation: "In this example, White's knight forks Black's queen and king with the move Ne6, forcing Black to lose material."
    },
    {
        name: "Pin",
        description: "Immobilize an opponent's piece by placing it between your attacking piece and a more valuable piece (like their king).",
        fen: "rnbqkbnr/ppp2ppp/8/3pp3/8/5NP1/PPPPPP1P/RNBQKB1R w KQkq - 0 1",
        moves: ["f1g2", "g8f6", "e1g1", "f8d6", "d2d3", "e8g8", "c1g5"],
        explanation: "The bishop on g5 pins the knight on f6 to the queen. If the knight moves, the queen would be captured."
    },
    {
        name: "Discovered Attack",
        description: "Move one piece to reveal an attack from another piece behind it, creating two threats at once.",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
        moves: ["c4f7", "e8f7", "d2d3", "f6e4", "c1e3", "d7d5", "d3e4", "d5e4", "d1d8"],
        explanation: "Moving the knight away reveals an attack from the queen on d1 to the rook on d8, demonstrating a discovered attack."
    },
    {
        name: "Zwischenzug",
        description: "Make an unexpected intermediate move before executing an anticipated move, often catching opponents off-guard.",
        fen: "r1bqkb1r/ppp2ppp/2np1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",
        moves: ["c1g5", "f8e7", "f3e5", "c6e5", "g5f6", "e7f6", "d1h5", "g7g6", "h5e5"],
        explanation: "Instead of recapturing immediately, White plays the in-between move Bxf6, forcing Black to recapture before continuing with the attack."
    },
    {
        name: "Double Check",
        description: "Deliver check with two pieces simultaneously, forcing the opponent's king to move since blocking or capturing isn't possible against both attackers.",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
        moves: ["e1g1", "d7d6", "f3g5", "c6d4", "c4f7", "e8e7", "g5f7"],
        explanation: "The knight delivers a check while simultaneously revealing a check from the bishop – this double check can only be escaped by moving the king."
    },
    {
        name: "Back Rank Mate",
        description: "Exploit an opponent's trapped king on their back rank with a rook or queen delivering checkmate.",
        fen: "6k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1",
        moves: ["f1f8"],
        explanation: "The rook delivers checkmate on the back rank because the king is trapped by its own pawns, with no escape squares."
    },
    {
        name: "Smothered Mate",
        description: "Use a knight to checkmate a king that's surrounded by its own pieces, preventing escape.",
        fen: "r1bqkb1r/ppp2ppp/2n5/3np3/2B5/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 1",
        moves: ["f3e5", "c6e5", "d1h5", "g7g6", "h5e5", "g8h8", "e5h8"],
        explanation: "The queen sacrifices itself to set up a knight checkmate where the king is smothered by its own pieces."
    },
    {
        name: "Sacrifice",
        description: "Give up material (pawns or pieces) for positional advantage, attacking opportunities, or to expose the opponent's king.",
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
        moves: ["c4f7", "e8f7", "f3e5", "c6e5", "d1h5", "g7g6", "h5e5"],
        explanation: "White sacrifices the bishop to expose the king, then follows up with tactical threats that lead to material gain or checkmate."
    },
    {
        name: "Overloaded Piece",
        description: "Target a defending piece that's protecting multiple important squares or pieces, forcing it to abandon one of its defensive duties.",
        fen: "r1bqkb1r/ppp2ppp/2n5/3np3/2BP4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 1",
        moves: ["d4e5", "d8d1", "e1d1", "c6e5", "c1g5", "f7f6", "g5h4"],
        explanation: "The knight on e5 is overloaded, defending both the c6 square and the pawn on f7. By attacking it, White forces Black to make a difficult choice."
    },
    {
        name: "Zugzwang",
        description: "Create a position where any move your opponent makes will worsen their position, often decisive in endgames.",
        fen: "8/8/1p3pk1/p7/P1P1K1P1/8/8/8 w - - 0 1",
        moves: ["e4d4", "g6g5", "d4e4", "g5g4", "e4f4"],
        explanation: "Black is in zugzwang - any pawn move weakens the position, and the king must stay to defend the pawns, but this allows White's king to approach and win."
    }
];

const TacticsDrills = () => {
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
        if (currentMoveIndex < selectedTactic.moves.length - 1) {
          handleNext();
        } else {
          setIsAnimating(false);
        }
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [isAnimating, currentMoveIndex]);

  const loadTactic = (tactic) => {
    setSelectedTactic(tactic);
    setCurrentMoveIndex(0);
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
        <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-4">
            <ChevronRight size={20} className="rotate-180 mr-1" />
            <span>Back to Home</span>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-red-600 mb-2">Master Chess Tactics</h1>
          <p className="text-sm lg:text-base text-gray-400">Click on any tactic below to see it demonstrated</p>
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
                <p className="text-sm text-gray-300">{tactic.description}</p>
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

export default TacticsDrills;