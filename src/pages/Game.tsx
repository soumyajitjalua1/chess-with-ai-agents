import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Move } from 'chess.js';

export default function ChessGame() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
  
    // Improved move handling with functional updates
    const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
      // Create a copy of the current game state
      const gameCopy = new Chess(game.fen());
      
      try {
        // Attempt to make the move
        const move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Auto-queen on promotion
        });
  
        // If invalid move, reset the piece
        if (!move) return false;
  
        // Update game state and move history
        setGame(gameCopy);
        setMoveHistory(prev => [...prev, `${move.from}-${move.to}`]);
        return true;
  
      } catch (error) {
        console.error('Invalid move:', error);
        return false;
      }
    }, [game.fen()]); // Only update when FEN changes
  
    // Improved undo functionality
    const undoMove = () => {
      setGame(prev => {
        const gameCopy = new Chess(prev.fen());
        gameCopy.undo();
        setMoveHistory(prevHistory => prevHistory.slice(0, -1));
        return gameCopy;
      });
    };
  

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex gap-8 font-sans">
          {/* Left Panel */}
          <div className="flex-1 max-w-2xl">
            {/* Time and Player */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <div className="flex justify-between text-gray-600">
                <span>12:45</span>
                <span>Player</span>
              </div>
            </div>
    
            {/* Chess Board */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Chessboard 
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={560}
                arePremovesAllowed={false}
                customBoardStyle={{
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
                customDarkSquareStyle={{ backgroundColor: '#779556' }}
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                boardOrientation="white"
              />
            </div>
          </div>

      {/* Right Panel */}
      <div className="w-80 space-y-6">
        {/* NeoMind AI Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">NeoMind AI</h2>
          <span className="text-sm text-gray-500 block mb-4">Grandmaster Level</span>
          
          <div className="space-y-2">
            <button className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition">
              Request Hint
            </button>
            <button 
              onClick={undoMove}
              className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Undo Move
            </button>
            <button className="w-full bg-green-100 text-green-600 px-4 py-2 rounded hover:bg-green-200 transition">
              Analyze Position
            </button>
          </div>
        </div>

        {/* Opponent Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold">Alexander Magnus</h2>
          <span className="text-sm text-gray-500">Rating: 2150</span>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Game Intensity</h3>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="w-3/4 h-full bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Move History */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Move History</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {moveHistory.map((move, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                {index + 1}. {move}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}