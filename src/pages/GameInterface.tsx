import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Clock, Lightbulb, RotateCcw, BarChart3 } from 'lucide-react';

// Constants
const MAX_USAGE = 2;

// Chess game component with AI integration
const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerTime, setPlayerTime] = useState(15 * 60); // 15 minutes in seconds
  const [aiTime, setAiTime] = useState(15 * 60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('');
  const [playersTurn, setPlayersTurn] = useState(false); // Start with AI's turn
  const [showHint, setShowHint] = useState(false);
  const [hints, setHints] = useState([]);
  const [positionAnalysis, setPositionAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiThinking, setAiThinking] = useState(true);
  const [hintUsageCount, setHintUsageCount] = useState(0);
  const [analysisUsageCount, setAnalysisUsageCount] = useState(0);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      if (playersTurn) {
        setPlayerTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStatus('Time out! AI wins.');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setAiTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStatus('Time out! You win.');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [playersTurn, gameOver]);

  // AI's first move on component mount
  useEffect(() => {
    // Make AI's first move after a short delay
    const timer = setTimeout(() => {
      makeAiMove();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Check for game end conditions
  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isCheckmate()) {
        setGameStatus(playersTurn ? 'Checkmate! AI wins.' : 'Checkmate! You win.');
      } else if (game.isDraw()) {
        setGameStatus('Game ended in a draw.');
      } else if (game.isStalemate()) {
        setGameStatus('Game ended in stalemate.');
      } else if (game.isThreefoldRepetition()) {
        setGameStatus('Game ended by threefold repetition.');
      } else if (game.isInsufficientMaterial()) {
        setGameStatus('Game ended due to insufficient material.');
      }
    }
  }, [game, playersTurn]);

  // Effect to trigger AI move when it's AI's turn
  useEffect(() => {
    if (!playersTurn && !gameOver && !aiThinking) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [playersTurn, gameOver, aiThinking]);

  // AI move function
  const makeAiMove = async () => {
    if (gameOver || playersTurn) return;
    
    setAiThinking(true);

    try {
      // We'll simulate an API call to a model like Groq
      // In a real implementation, you would use the Groq API with the provided key
      setTimeout(() => {
        const possibleMoves = game.moves({ verbose: true });
        if (possibleMoves.length > 0) {
          // For demonstration, we'll choose a semi-intelligent move
          // In production, you'd use the actual AI response
          const bestMoves = findBestMoves(game, possibleMoves);
          const move = bestMoves[Math.floor(Math.random() * Math.min(3, bestMoves.length))];
          
          const gameCopy = new Chess(game.fen());
          gameCopy.move(move);
          
          const moveNotation = `${move.from}${move.to}${move.promotion ? move.promotion : ''}`;
          setMoveHistory(prev => [...prev, moveNotation]);
          setGame(gameCopy);
          setPlayersTurn(true);
          setAiThinking(false);
          
          // Check if game ended after AI move
          if (gameCopy.isGameOver()) {
            setGameOver(true);
            if (gameCopy.isCheckmate()) {
              setGameStatus('Checkmate! AI wins.');
            } else if (gameCopy.isDraw()) {
              setGameStatus('Game ended in a draw.');
            }
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error making AI move:", error);
      setAiThinking(false);
    }
  };

  // Simple AI move selection (in a real app, this would use the Groq API)
  const findBestMoves = (chess, possibleMoves) => {
    // Simple heuristic: prioritize captures, checks, and promotions
    const scoredMoves = possibleMoves.map(move => {
      let score = 0;
      
      // Simulate the move
      const gameCopy = new Chess(chess.fen());
      gameCopy.move(move);
      
      // Captures
      if (move.captured) {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
        score += pieceValues[move.captured] || 1;
      }
      
      // Checks
      if (gameCopy.isCheck()) {
        score += 2;
      }
      
      // Promotions
      if (move.promotion) {
        score += 8;
      }
      
      // Center control (e4, d4, e5, d5)
      const centerSquares = ['e4', 'd4', 'e5', 'd5'];
      if (centerSquares.includes(move.to)) {
        score += 1;
      }
      
      // Development of pieces in opening
      if (chess.history().length < 10) {
        if (move.piece === 'n' || move.piece === 'b') {
          score += 1;
        }
      }
      
      // Avoid moves that put AI in check
      const opponentMoves = gameCopy.moves({ verbose: true });
      const opponentChecks = opponentMoves.filter(m => {
        const testCopy = new Chess(gameCopy.fen());
        testCopy.move(m);
        return testCopy.isCheck();
      });
      
      if (opponentChecks.length > 0) {
        score -= 3;
      }
      
      return { ...move, score };
    });
    
    // Sort by score and take top moves
    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves.slice(0, 5); // Return top 5 moves
  };

  // Handle player moves
  const onDrop = useCallback((sourceSquare, targetSquare) => {
    if (!playersTurn || gameOver) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      });

      if (!move) return false;
      
      const moveNotation = `${move.from}${move.to}${move.promotion ? move.promotion : ''}`;
      setMoveHistory(prev => [...prev, moveNotation]);
      setGame(gameCopy);
      setPlayersTurn(false);
      setShowHint(false);

      // Clear any analysis or hints when a move is made
      setHints([]);
      setPositionAnalysis(null);
      
      return true;
    } catch (error) {
      console.error("Error making move:", error);
      return false;
    }
  }, [game, playersTurn, gameOver]);

  // Request hints
  const requestHint = () => {
    if (gameOver || !playersTurn || hintUsageCount >= MAX_USAGE) return;
    
    // Increment usage count
    setHintUsageCount(prev => prev + 1);
    
    // In a real app, you'd call the AI API here
    const possibleMoves = game.moves({ verbose: true });
    const bestMoves = findBestMoves(game, possibleMoves).slice(0, 2);
    
    setHints(bestMoves.map(move => ({
      from: move.from,
      to: move.to,
      explanation: getHintExplanation(move)
    })));
    
    setShowHint(true);
  };

  // Generate hint explanation
  const getHintExplanation = (move) => {
    const explanations = [
      `Consider moving your ${getPieceName(move.piece)} from ${move.from} to ${move.to}.`,
      `A strong option is to move ${getPieceName(move.piece)} to ${move.to}.`,
    ];
    
    if (move.captured) {
      return `You can capture the opponent's ${getPieceName(move.captured)} by moving your ${getPieceName(move.piece)} to ${move.to}.`;
    }
    
    return explanations[Math.floor(Math.random() * explanations.length)];
  };

  // Helper to get piece name
  const getPieceName = (piece) => {
    const pieceNames = {
      p: 'pawn',
      n: 'knight',
      b: 'bishop',
      r: 'rook',
      q: 'queen',
      k: 'king'
    };
    return pieceNames[piece] || piece;
  };

  // Analyze position
  const analyzePosition = () => {
    if (gameOver || isAnalyzing || analysisUsageCount >= MAX_USAGE) return;
    
    // Increment usage count
    setAnalysisUsageCount(prev => prev + 1);
    setIsAnalyzing(true);
    
    // In a real app, this would call the AI API
    setTimeout(() => {
      const fen = game.fen();
      const gameCopy = new Chess(fen);
      
      // Generate a simple position analysis
      let analysis = {
        position: fen,
        material: evaluateMaterial(gameCopy),
        inCheck: gameCopy.isCheck() ? 'Yes' : 'No',
        control: evaluateControl(gameCopy),
        suggestions: []
      };
      
      // Add move suggestions
      const bestMoves = findBestMoves(gameCopy, gameCopy.moves({ verbose: true })).slice(0, 3);
      analysis.suggestions = bestMoves.map(move => ({
        move: `${move.from}-${move.to}`,
        explanation: getAnalysisExplanation(move)
      }));
      
      setPositionAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Generate analysis explanation
  const getAnalysisExplanation = (move) => {
    if (move.captured) {
      return `Captures opponent's ${getPieceName(move.captured)}.`;
    } else if (move.promotion) {
      return `Promotes pawn to ${getPieceName(move.promotion)}.`;
    } else {
      const explanations = [
        `Improves piece positioning.`,
        `Controls important squares.`,
        `Develops your position.`,
        `Increases mobility.`
      ];
      return explanations[Math.floor(Math.random() * explanations.length)];
    }
  };

  // Evaluate material
  const evaluateMaterial = (chess) => {
    const board = chess.board();
    let whiteMaterial = 0;
    let blackMaterial = 0;
    
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          if (piece.color === 'w') {
            whiteMaterial += pieceValues[piece.type];
          } else {
            blackMaterial += pieceValues[piece.type];
          }
        }
      }
    }
    
    const advantage = whiteMaterial - blackMaterial;
    if (advantage > 0) {
      return `White has a material advantage of +${advantage}.`;
    } else if (advantage < 0) {
      return `Black has a material advantage of +${Math.abs(advantage)}.`;
    } else {
      return `Material is even.`;
    }
  };

  // Evaluate board control
  const evaluateControl = (chess) => {
    const whiteMoves = new Chess(chess.fen());
    whiteMoves.load(chess.fen());
    const blackMoves = new Chess(chess.fen());
    blackMoves.load(chess.fen());
    
    // Force turn to calculate available moves
    if (chess.turn() === 'b') {
      const fen = chess.fen();
      const parts = fen.split(' ');
      parts[1] = 'w';
      whiteMoves.load(parts.join(' '));
    } else {
      const fen = chess.fen();
      const parts = fen.split(' ');
      parts[1] = 'b';
      blackMoves.load(parts.join(' '));
    }
    
    const whiteControlCount = whiteMoves.moves().length;
    const blackControlCount = blackMoves.moves().length;
    
    if (whiteControlCount > blackControlCount + 3) {
      return `White has better board control with ${whiteControlCount} possible moves.`;
    } else if (blackControlCount > whiteControlCount + 3) {
      return `Black has better board control with ${blackControlCount} possible moves.`;
    } else {
      return `Board control is fairly even.`;
    }
  };

  // Undo last two moves (player and AI)
  const undoMove = () => {
    if (moveHistory.length < 2 || gameOver) return;
    
    const gameCopy = new Chess(game.fen());
    gameCopy.undo(); // Undo player move
    gameCopy.undo(); // Undo AI move
    
    setGame(gameCopy);
    setMoveHistory(prev => prev.slice(0, -2));
    setPlayersTurn(true);
    setShowHint(false);
    setHints([]);
    setPositionAnalysis(null);
    
    // Reset game over state if undoing from a terminal position
    if (gameOver) {
      setGameOver(false);
      setGameStatus('');
    }
  };

  // Format move history for display
  const getFormattedMoveHistory = () => {
    const formatted = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      const whiteMove = moveHistory[i];
      const blackMove = i + 1 < moveHistory.length ? moveHistory[i + 1] : '';
      formatted.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: whiteMove,
        black: blackMove
      });
    }
    return formatted;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left sidebar - AI and controls */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <Timer time={formatTime(aiTime)} label="AI" isAI={true} />
            <div className="my-6">
              <AIAvatar />
            </div>
            
            <div className="w-full space-y-3 mt-4">
              <ActionButton 
                icon={<Lightbulb size={18} />} 
                label="Request Hint" 
                onClick={requestHint} 
                variant="blue"
                disabled={!playersTurn || gameOver}
                usageCount={hintUsageCount}
              />
              <ActionButton 
                icon={<RotateCcw size={18} />} 
                label="Undo Move" 
                onClick={undoMove} 
                variant="red"
                disabled={moveHistory.length < 2 || gameOver}
              />
              <ActionButton 
                icon={<BarChart3 size={18} />} 
                label="Analyze Position" 
                onClick={analyzePosition} 
                variant="green"
                disabled={gameOver || isAnalyzing}
                usageCount={analysisUsageCount}
              />
            </div>
          </div>
          
          {/* Hints section */}
          {showHint && hints.length > 0 && (
            <div className="bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">Suggested Moves:</h3>
              <ul className="space-y-2">
                {hints.map((hint, idx) => (
                  <li key={idx} className="text-blue-300 text-sm">
                    <span className="font-bold">{hint.from} → {hint.to}:</span> {hint.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Analysis section */}
          {positionAnalysis && (
            <div className="bg-green-900/20 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">Position Analysis:</h3>
              <div className="text-green-300 text-sm space-y-2">
                <p>{positionAnalysis.material}</p>
                <p>In check: {positionAnalysis.inCheck}</p>
                <p>{positionAnalysis.control}</p>
                <h4 className="font-bold mt-2">Suggested Moves:</h4>
                <ul className="space-y-1">
                  {positionAnalysis.suggestions.map((suggestion, idx) => (
                    <li key={idx}><span className="font-bold">{suggestion.move}:</span> {suggestion.explanation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Center - Chessboard */}
        <div className="md:col-span-6 flex flex-col justify-center items-center bg-gray-900 rounded-lg p-4">
          <div className="relative w-full max-w-lg">
            <Chessboard 
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={560}
              customBoardStyle={{
                borderRadius: '0.5rem',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                width: '100%',
                height: '100%'
              }}
              customDarkSquareStyle={{ backgroundColor: '#779556' }}
              customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
              boardOrientation="white"
              animationDuration={200}
            />
          </div>
          
          {gameOver && (
            <div className="mt-4 p-3 bg-red-900/30 text-white font-bold rounded">
              {gameStatus}
            </div>
          )}
          
          {!gameOver && (
            <div className="mt-4 p-3 bg-blue-900/30 text-white rounded">
              {playersTurn ? "Your turn" : "AI is thinking..."}
            </div>
          )}
        </div>
        
        {/* Right sidebar - Move history */}
        <div className="md:col-span-3 space-y-6">
          <Timer time={formatTime(playerTime)} label="Player" />
          <MoveHistory moves={getFormattedMoveHistory()} />
          
          {/* Game status */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Game Status</h3>
            <div className="text-sm text-gray-300">
              {gameOver ? (
                <span className="text-red-400">{gameStatus}</span>
              ) : (
                <>
                  <p>Current turn: <span className="font-bold">{playersTurn ? "Player" : "AI"}</span></p>
                  <p className="mt-1">Time remaining: {playersTurn ? formatTime(playerTime) : formatTime(aiTime)}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying timer
const Timer = ({ time, label, isAI = false }) => {
  return (
    <div className={`p-4 rounded-lg w-full ${isAI ? 'bg-red-900/20' : 'bg-blue-900/20'}`}>
      <div className="text-2xl font-mono font-bold text-center">{time}</div>
      <div className="text-xs text-gray-400 text-center">{label}</div>
    </div>
  );
};

// Component for AI avatar
const AIAvatar = () => {
  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-2 border-2 border-red-500/50">
        <img 
          src="https://cdn.prod.website-files.com/60d04919d1bfb15197ff937e/6609f8d1783e3c6b959e7d9c_uc.jpeg" 
          alt="AI Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-white font-bold text-xl text-center">NeoMind AI</div>
      <div className="text-red-400 text-sm text-center">Grandmaster Level</div>
    </div>
  );
};

// Component for action buttons
const ActionButton = ({ icon, label, onClick, variant, disabled = false, usageCount = 0 }) => {
  const getOpacity = () => {
    if (disabled) return 'opacity-50';
    if (usageCount >= MAX_USAGE) return 'opacity-30';
    if (usageCount === 1) return 'opacity-60';
    return 'opacity-100';
  };

  const colorClasses = {
    blue: "bg-blue-900/20 hover:bg-blue-900/30 text-blue-400",
    red: "bg-red-900/20 hover:bg-red-900/30 text-red-400",
    green: "bg-green-900/20 hover:bg-green-900/30 text-green-400",
  };
  
  const buttonClass = colorClasses[variant] || colorClasses.blue;
  const opacity = getOpacity();
  
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-start w-full p-3 rounded-lg ${buttonClass} transition-colors duration-200 ${opacity} ${disabled || usageCount >= MAX_USAGE ? 'cursor-not-allowed' : ''}`}
      disabled={disabled || usageCount >= MAX_USAGE}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
      {(variant === 'blue' || variant === 'green') && (
        <span className="ml-auto text-xs">
          {MAX_USAGE - usageCount} left
        </span>
      )}
    </button>
  );
};

// Component for move history
const MoveHistory = ({ moves }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock size={16} /> Move History
      </h3>
      {moves.length === 0 ? (
        <div className="text-gray-400 text-sm">No moves yet</div>
      ) : (
        <div className="space-y-2">
          {moves.map((move, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="w-8 text-gray-500">{move.moveNumber}.</div>
              <div className="w-16 text-gray-300">{move.white}</div>
              <div className="w-16 text-gray-300">{move.black}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChessGame;