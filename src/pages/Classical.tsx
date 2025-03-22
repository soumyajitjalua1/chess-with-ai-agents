import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';

// Add missing type definitions
type ChessPiece = {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
};

type ChessSquare = ChessPiece | null;
type ChessBoard = ChessSquare[][];

type GameState = 'setup' | 'playing' | 'ended';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type PlayerColor = 'white' | 'black';

const ClassicChess: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [chessInstance, setChessInstance] = useState<Chess | null>(null);
  const [board, setBoard] = useState<ChessBoard>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [gameResult, setGameResult] = useState<string>('');
  
  // Game settings
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [timeControl, setTimeControl] = useState<{ minutes: number, increment: number }>({ minutes: 10, increment: 5 });
  
  // Game timers
  const [playerTime, setPlayerTime] = useState<number>(600); // 10 minutes in seconds
  const [aiTime, setAiTime] = useState<number>(600);
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation controls
  const controls = useAnimation();


  

  // Initialize chess instance
  useEffect(() => {
    if (gameState === 'playing' && !chessInstance) {
      const chess = new Chess();
      setChessInstance(chess);
      updateBoard(chess);
      setPlayerTime(timeControl.minutes * 60);
      setAiTime(timeControl.minutes * 60);
      setCurrentPlayer('w');
      setMoveHistory([]);
      setMessage(playerColor === 'white' ? 'Your move' : 'AI is thinking...');
      
      // If AI starts first (player is black)
      if (playerColor === 'black') {
        setTimeout(() => makeAIMove(chess), 1000);
      }
    }
  }, [gameState, playerColor, timeControl]);

  // Handle timer logic
  useEffect(() => {
    if (gameState === 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        if (currentPlayer === 'w' && playerColor === 'white') {
          setPlayerTime(time => {
            if (time <= 0) {
              clearInterval(timerRef.current!);
              endGame('Time out. AI wins!');
              return 0;
            }
            return time - 1;
          });
        } else if (currentPlayer === 'b' && playerColor === 'black') {
          setPlayerTime(time => {
            if (time <= 0) {
              clearInterval(timerRef.current!);
              endGame('Time out. AI wins!');
              return 0;
            }
            return time - 1;
          });
        } else {
          setAiTime(time => {
            if (time <= 0) {
              clearInterval(timerRef.current!);
              endGame('AI ran out of time. You win!');
              return 0;
            }
            return time - 1;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, currentPlayer, playerColor]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Update the board state from chess.js
  const updateBoard = (chess: Chess) => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = chess.get(indexToSquare(i, j) as Square);
        if (piece) {
          newBoard[i][j] = piece;
        }
      }
    }
    
    setBoard(newBoard);
  };

  // Convert board index to chess notation
  const indexToSquare = (row: number, col: number): string => {
    const files = 'abcdefgh';
    return `${files[col]}${8 - row}`;
  };

  // Convert chess notation to board index
  const squareToIndex = (square: string): [number, number] => {
    const files = 'abcdefgh';
    const col = files.indexOf(square[0]);
    const row = 8 - parseInt(square[1]);
    return [row, col];
  };

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameState !== 'playing' || !chessInstance) return;
    
    // If it's not the player's turn, do nothing
    const playerTurn = playerColor === 'white' ? 'w' : 'b';
    if (chessInstance.turn() !== playerTurn) return;
    
    const square = indexToSquare(row, col);
    
    // If there's already a selected square, try to move
    if (selectedSquare) {
      // Check if the clicked square is a valid move
      if (possibleMoves.includes(square)) {
        // Make the move
        const moveResult = chessInstance.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        });
        
        if (moveResult) {
          // Update the board
          updateBoard(chessInstance);
          
          // Add move to history
          const newHistory = [...moveHistory, moveResult.san];
          setMoveHistory(newHistory);
          
          // Add time increment
          if (playerColor === 'white') {
            setPlayerTime(time => time + timeControl.increment);
          } else {
            setPlayerTime(time => time + timeControl.increment);
          }
          
          // Switch turn
          setCurrentPlayer(chessInstance.turn());
          
          // Check game status
          checkGameStatus(chessInstance);
          
          // Reset selection
          setSelectedSquare(null);
          setPossibleMoves([]);
          
          // If game is still ongoing, make AI move
          if (!chessInstance.isGameOver()) {
            setMessage('AI is thinking...');
            setTimeout(() => makeAIMove(chessInstance), 1000);
          }
        }
      } else {
        // If clicking on own piece, select it instead
        const piece = chessInstance.get(square as Square);
        if (piece && piece.color === playerTurn) {
          selectSquare(square, chessInstance);
        } else {
          // If clicking on empty square or opponent's piece, deselect
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // If no square is selected, select the square if it has a piece of the current player
      const piece = chessInstance.get(square as Square);
      if (piece && piece.color === playerTurn) {
        selectSquare(square, chessInstance);
      }
    }
  };

  // Select a square and find possible moves
  const selectSquare = (square: string, chess: Chess) => {
    setSelectedSquare(square);
    
    // Get possible moves for the selected piece
    const moves = chess.moves({ square: square as Square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  };

  // Make AI move based on difficulty
  const makeAIMove = (chess: Chess) => {
    if (!chess || chess.isGameOver()) return;
    
    // Get all possible moves
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;
    
    let selectedMove;
    
    switch (difficulty) {
      case 'beginner':
        // Random move
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
        break;
        
        case 'intermediate':
            // Prioritize captures and checks
            const captureMoves = moves.filter(move => move.captured);
            const checkMoves = moves.filter(move => move.san.includes('+'));
            
            if (checkMoves.length > 0) {
              selectedMove = checkMoves[Math.floor(Math.random() * checkMoves.length)];
            } else if (captureMoves.length > 0) {
              selectedMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            } else {
              selectedMove = moves[Math.floor(Math.random() * moves.length)];
            }
            break;
        
            case 'advanced':
                // Use move's captured property for value assessment
                const valuePieces = {
                  p: 1,
                  n: 3,
                  b: 3,
                  r: 5,
                  q: 9,
                  k: 0
                };
                
                // Sort moves by captured piece value
                const sortedMoves = [...moves].sort((a, b) => {
                  const valueA = a.captured ? valuePieces[a.captured] : 0;
                  const valueB = b.captured ? valuePieces[b.captured] : 0;
                  return valueB - valueA;
                });
                
                // 70% chance to choose the best move, 30% random
                selectedMove = Math.random() < 0.7 && sortedMoves[0] 
                  ? sortedMoves[0] 
                  : moves[Math.floor(Math.random() * moves.length)];
                break;
            }
    
    // Make the move
    if (selectedMove) {
        chess.move(selectedMove);
        updateBoard(chess);
        
        // Add move to history
        const newHistory = [...moveHistory, selectedMove.san];
        setMoveHistory(newHistory);
        
        // Add time increment to AI's time
        setAiTime(time => time + timeControl.increment);
        
        // Switch turn
        setCurrentPlayer(chess.turn());
        
        // Check game status
        checkGameStatus(chess);
        
        // If game continues, set player's turn message
        if (!chess.isGameOver()) {
          setMessage('Your move');
        }
      }
    };

  // Check if the game is over
  const checkGameStatus = (chess: Chess) => {
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'Black' : 'White';
        endGame(`Checkmate! ${winner} wins!`);
      } else if (chess.isDraw()) {
        if (chess.isStalemate()) {
          endGame('Stalemate! Game is a draw.');
        } else if (chess.isThreefoldRepetition()) {
          endGame('Threefold repetition! Game is a draw.');
        } else if (chess.isInsufficientMaterial()) {
          endGame('Insufficient material! Game is a draw.');
        } else {
          endGame('50-move rule! Game is a draw.');
        }
      }
    }
  };

  // End the game
  const endGame = (result: string) => {
    setGameState('ended');
    setGameResult(result);
    setMessage(result);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Start a new game
  const startGame = () => {
    setGameState('playing');
    setMessage('');
    setGameResult('');
    setChessInstance(null);
  };

  // Handle player resignation
  const handleResign = () => {
    endGame('You resigned. AI wins!');
  };

  // Handle offer draw
  const handleOfferDraw = () => {
    // For simplicity, AI accepts draw 50% of the time
    if (Math.random() < 0.5) {
      endGame('Draw offer accepted.');
    } else {
      setMessage('AI declined draw offer. Game continues.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Render piece with Unicode character
  const renderPiece = (piece: ChessPiece | null) => {
    if (!piece) return null;
    
    const pieceSymbols = {
      'w': {
        'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔'
      },
      'b': {
        'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
      }
    };
    
    return (
      <div className={`piece ${piece.color === 'w' ? 'text-white' : 'text-black'} text-4xl select-none`}>
        {pieceSymbols[piece.color][piece.type]}
      </div>
    );
  };

  // Render move history in pairs (white and black moves)
  const renderMoveHistory = () => {
    const pairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1] || ''
      });
    }
    
    return pairs.map((pair, index) => (
      <div key={index} className="flex text-sm">
        <div className="w-8 text-gray-500">{pair.moveNumber}.</div>
        <div className="w-16">{pair.white}</div>
        <div className="w-16">{pair.black}</div>
      </div>
    ));
  };

  // Check if it's the player's turn
  const isPlayerTurn = () => {
    if (!chessInstance) return false;
    return (playerColor === 'white' && chessInstance.turn() === 'w') || 
           (playerColor === 'black' && chessInstance.turn() === 'b');
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Classic', path: '/Playclassic' },
    { name: 'AI Challenge', path: '/play-ai-challenge' },
    { name: 'Multiplayer', path: '/multiplayer' },
  ];

  return (
    <div className="min-h-screen bg-chess-dark text-white">
      {/* Header */}
      <header className="bg-chess-darker py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-chess-red rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">♟</span>
            </div>
            <h1 className="text-2xl font-bold text-red-500">AI Chess Arena</h1>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-chess-red font-medium'
                      : 'text-gray-300 hover:text-white'
                  } transition-colors duration-300 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              
            </div>
          </div>
          {/* <button className="btn-primary">Sign In</button> */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {gameState === 'setup' ? (
          <motion.div 
            className="max-w-xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-3xl font-bold mb-6 text-center"
              variants={itemVariants}
            >
              Classic Chess
            </motion.h2>
            
            <motion.p 
              className="text-gray-400 mb-8 text-center"
              variants={itemVariants}
            >
              Master the timeless game with our advanced AI opponents.
            </motion.p>
            
            <motion.div 
              className="bg-chess-darker p-6 rounded-lg mb-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">Game Settings</h3>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Difficulty</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-4 rounded ${difficulty === 'beginner' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setDifficulty('beginner')}
                  >
                    Beginner
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${difficulty === 'intermediate' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setDifficulty('intermediate')}
                  >
                    Intermediate
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${difficulty === 'advanced' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setDifficulty('advanced')}
                  >
                    Advanced
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Play As</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-4 rounded ${playerColor === 'white' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setPlayerColor('white')}
                  >
                    White
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${playerColor === 'black' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setPlayerColor('black')}
                  >
                    Black
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Time Control</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-4 rounded ${timeControl.minutes === 5 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setTimeControl({ minutes: 5, increment: 3 })}
                  >
                    5 min
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${timeControl.minutes === 10 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setTimeControl({ minutes: 10, increment: 5 })}
                  >
                    10 min
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${timeControl.minutes === 15 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setTimeControl({ minutes: 15, increment: 10 })}
                  >
                    15 min
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              className="w-full py-3 bg-red-500 hover:bg-red-600 rounded font-semibold text-white transition-colors"
              onClick={startGame}
              variants={itemVariants}
            >
              Start Game
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Game board section */}
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="bg-chess-darker p-4 rounded-lg shadow-lg">
                {/* AI info and timer */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                      AI
                    </div>
                    <div className="ml-2">
                      <div className="font-semibold text-sm">NeoMind AI</div>
                      <div className="text-xs text-gray-400">
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded bg-gray-700 font-mono text-sm ${aiTime < 30 ? 'text-red-500' : ''}`}>
                    {formatTime(aiTime)}
                  </div>
                </div>
                
                {/* Chess board */}
                <div className="relative w-[550px] mx-auto mb-4">
                  <Chessboard 
                    position={chessInstance ? chessInstance.fen() : 'start'}
                    onPieceDrop={(sourceSquare, targetSquare) => {
                      if (!chessInstance || gameState !== 'playing') return false;
                      
                      const playerTurn = playerColor === 'white' ? 'w' : 'b';
                      if (chessInstance.turn() !== playerTurn) return false;

                      try {
                        const move = chessInstance.move({
                          from: sourceSquare,
                          to: targetSquare,
                          promotion: 'q' // Always promote to queen for simplicity
                        });

                        if (move) {
                          updateBoard(chessInstance);
                          setMoveHistory(prev => [...prev, move.san]);
                          
                          if (playerColor === 'white') {
                            setPlayerTime(time => time + timeControl.increment);
                          } else {
                            setPlayerTime(time => time + timeControl.increment);
                          }
                          
                          setCurrentPlayer(chessInstance.turn());
                          checkGameStatus(chessInstance);
                          
                          if (!chessInstance.isGameOver()) {
                            setMessage('AI is thinking...');
                            setTimeout(() => makeAIMove(chessInstance), 1000);
                          }
                          return true;
                        }
                        return false;
                      } catch (error) {
                        return false;
                      }
                    }}
                    boardWidth={500}
                    customBoardStyle={{
                      borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                      height: '500px',
                      width: '100%'
                    }}
                    customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                    customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                    boardOrientation={playerColor === 'black' ? 'black' : 'white'}
                  />
                </div>
                
                {/* Player info and timer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                      YOU
                    </div>
                    <div className="ml-2">
                      <div className="font-semibold text-sm">You</div>
                      <div className="text-xs text-gray-400">
                        Playing as {playerColor}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded bg-gray-700 font-mono text-sm ${playerTime < 30 ? 'text-red-500' : ''}`}>
                    {formatTime(playerTime)}
                  </div>
                </div>
              </div>
              
              {/* Game controls */}
              <div className="flex gap-4 mt-4">
                <button 
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors"
                  onClick={handleResign}
                  disabled={gameState === 'ended'}
                >
                  Resign
                </button>
                <button 
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors"
                  onClick={handleOfferDraw}
                  disabled={gameState === 'ended'}
                >
                  Offer Draw
                </button>
                <button 
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 rounded font-semibold transition-colors"
                  onClick={() => setGameState('setup')}
                >
                  New Game
                </button>
              </div>
            </div>
            
            {/* Game info section */}
            <div className="lg:w-64">
              {/* Game status */}
              <div className="bg-chess-darker p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Game Status</h3>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-sm">{message}</p>
                </div>
                
                {gameState === 'playing' && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Turn:</span>
                      <span>{isPlayerTurn() ? 'Your move' : 'AI thinking'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pieces taken:</span>
                      <span>{moveHistory.filter(move => move.includes('x')).length}</span>
                    </div>
                  </div>
                )}
                
                {gameState === 'ended' && (
                  <button 
                    className="w-full mt-4 py-2 bg-red-500 hover:bg-red-600 rounded font-semibold transition-colors"
                    onClick={() => setGameState('setup')}
                  >
                    Play Again
                  </button>
                )}
              </div>
              
              {/* Move history */}
              <div className="bg-chess-darker p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Move History</h3>
                <div className="bg-gray-800 p-3 rounded h-64 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <p className="text-sm text-gray-400">No moves yet</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {renderMoveHistory()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassicChess;