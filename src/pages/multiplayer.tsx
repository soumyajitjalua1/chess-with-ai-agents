import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chess, Square } from 'chess.js';

type ChessPiece = {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
};

type ChessSquare = ChessPiece | null;
type ChessBoard = ChessSquare[][];

type GameState = 'setup' | 'matchmaking' | 'playing' | 'ended';
type MatchStatus = 'searching' | 'found' | 'connected';

const MultiplayerChess: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [chessInstance, setChessInstance] = useState<Chess | null>(null);
  const [board, setBoard] = useState<ChessBoard>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [gameResult, setGameResult] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');

  // Multiplayer state
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('searching');
  const [opponentInfo, setOpponentInfo] = useState<{ name: string; rating: number } | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [timeControl, setTimeControl] = useState<{ minutes: number, increment: number }>({ minutes: 5, increment: 3 });
  const [playerTime, setPlayerTime] = useState<number>(300);
  const [opponentTime, setOpponentTime] = useState<number>(300);
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waitingForOpponentMove = useRef<boolean>(false);

  // Simulated WebSocket connection
  useEffect(() => {
    if (gameState === 'matchmaking') {
      setTimeout(() => {
        setMatchStatus('found');
        setOpponentInfo({
          name: 'Opponent_' + Math.floor(Math.random() * 1000),
          rating: Math.floor(Math.random() * 1500) + 800
        });
        setTimeout(() => {
          setMatchStatus('connected');
          startGame();
        }, 2000);
      }, 3000);
    }
  }, [gameState]);

  const startGame = () => {
    const chess = new Chess();
    setChessInstance(chess);
    updateBoard(chess);
    setPlayerTime(timeControl.minutes * 60);
    setOpponentTime(timeControl.minutes * 60);
    setGameState('playing');
    setMessage("Game started! White's turn");
    setGameId('MP' + Date.now().toString(36).toUpperCase());

    // If player is black, simulate first move by opponent (white)
    if (playerColor === 'black') {
      waitingForOpponentMove.current = true;
      setTimeout(() => simulateOpponentMove(chess), 1500);
    }
  };

  // Simulate opponent move
  const simulateOpponentMove = (chess: Chess) => {
    if (!chess || chess.isGameOver()) return;
    
    // Get all legal moves
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;
    
    // Choose a random legal move
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    
    // Make the move
    const moveResult = chess.move({
      from: randomMove.from,
      to: randomMove.to,
      promotion: 'q' // Always promote to queen for simplicity
    });
    
    if (moveResult) {
      // Update the board
      updateBoard(chess);
      
      // Add move to history
      const newHistory = [...moveHistory, moveResult.san];
      setMoveHistory(newHistory);
      
      // Add time increment
      setOpponentTime(time => time + timeControl.increment);
      
      // Switch turn
      setCurrentPlayer(chess.turn());
      
      // Check game status
      checkGameStatus(chess);
      
      // Update message
      setMessage(`Opponent played ${moveResult.san}. Your turn!`);
      
      // Set waiting flag to false
      waitingForOpponentMove.current = false;
    }
  };

  // Timer implementation
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        if (currentPlayer === 'w' && playerColor === 'white') {
          setPlayerTime(time => time > 0 ? time - 1 : 0);
        } else if (currentPlayer === 'b' && playerColor === 'black') {
          setPlayerTime(time => time > 0 ? time - 1 : 0);
        } else if (currentPlayer === 'w' && playerColor === 'black') {
          setOpponentTime(time => time > 0 ? time - 1 : 0);
        } else if (currentPlayer === 'b' && playerColor === 'white') {
          setOpponentTime(time => time > 0 ? time - 1 : 0);
        }
        
        // Check for timeout
        if (playerTime <= 0) endGame('Time out! You lose');
        if (opponentTime <= 0) endGame('Opponent time out! You win');
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentPlayer, playerTime, opponentTime, playerColor]);

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
    if (gameState !== 'playing' || !chessInstance || waitingForOpponentMove.current) return;
    
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
          
          // Set message
          setMessage(`You played ${moveResult.san}. Waiting for opponent...`);
          
          // Trigger opponent's move after a delay
          if (!chessInstance.isGameOver()) {
            waitingForOpponentMove.current = true;
            setTimeout(() => simulateOpponentMove(chessInstance), 1500);
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

  const endGame = (result: string) => {
    setGameState('ended');
    setGameResult(result);
    setMessage(result);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleResign = () => {
    endGame('You resigned. Opponent wins!');
  };

  const handleOfferDraw = () => {
    endGame('Draw offer accepted');
  };

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
          <motion.div className="max-w-xl mx-auto">
            {/* Multiplayer setup UI */}
            <motion.h2 className="text-3xl font-bold mb-6 text-center">
              Multiplayer Chess
            </motion.h2>
            
            <motion.div className="bg-chess-darker p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Game Settings</h3>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Play As</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      playerColor === 'white' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setPlayerColor('white')}
                  >
                    White
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      playerColor === 'black' ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
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
                    className={`flex-1 py-2 px-4 rounded ${
                      timeControl.minutes === 5 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setTimeControl({ minutes: 5, increment: 3 })}
                  >
                    5+3
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      timeControl.minutes === 10 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setTimeControl({ minutes: 10, increment: 5 })}
                  >
                    10+5
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      timeControl.minutes === 15 ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setTimeControl({ minutes: 15, increment: 10 })}
                  >
                    15+10
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              className="w-full py-3 bg-red-500 hover:bg-red-600 rounded font-semibold text-white transition-colors"
              onClick={() => setGameState('matchmaking')}
            >
              Find Opponent
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Game board section */}
            <div className="flex-1">
              <div className="bg-chess-darker p-4 rounded-lg shadow-lg">
                {/* Opponent info and timer */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      {opponentInfo?.name[0]}
                    </div>
                    <div className="ml-2">
                      <div className="font-semibold">{opponentInfo?.name}</div>
                      <div className="text-xs text-gray-400">
                        Rating: {opponentInfo?.rating}
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded bg-gray-700 font-mono ${
                    opponentTime < 30 ? 'text-red-500' : ''
                  }`}>
                    {formatTime(opponentTime)}
                  </div>
                </div>
                
                {/* Chess board */}
                <div className="aspect-square w-[550px] mx-auto bg-chess-board rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 8 }, (_, row) => (
                      Array.from({ length: 8 }, (_, col) => {
                        // Flip the board if player is black
                        const displayRow = playerColor === 'black' ? 7 - row : row;
                        const displayCol = playerColor === 'black' ? 7 - col : col;
                        
                        const square = indexToSquare(displayRow, displayCol);
                        const isSelected = selectedSquare === square;
                        const isPossibleMove = possibleMoves.includes(square);
                        const isWhiteSquare = (displayRow + displayCol) % 2 === 0;
                        
                        return (
                          <div
                            key={`${displayRow}-${displayCol}`}
                            className={`
                              ${isWhiteSquare ? 'bg-amber-200' : 'bg-amber-800'}
                              ${isSelected ? 'ring-2 ring-yellow-500' : ''}
                              ${isPossibleMove ? 'ring-2 ring-green-500' : ''}
                              relative flex items-center justify-center cursor-pointer
                              transition-all duration-150 hover:opacity-90
                            `}
                            onClick={() => handleSquareClick(displayRow, displayCol)}
                          >
                            {/* Render piece */}
                            {board[displayRow]?.[displayCol] && renderPiece(board[displayRow][displayCol])}
                            
                            {/* Render move indicator */}
                            {isPossibleMove && !board[displayRow]?.[displayCol] && (
                              <div className="absolute w-3 h-3 rounded-full bg-green-500 opacity-75"></div>
                            )}
                            
                            {/* Render square coordinates */}
                            {displayRow === 7 && (
                              <div className="absolute bottom-0 right-1 text-xs opacity-50">
                                {square[0]}
                              </div>
                            )}
                            {displayCol === 0 && (
                              <div className="absolute top-0 left-1 text-xs opacity-50">
                                {square[1]}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
                
                {/* Player info and timer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      YOU
                    </div>
                    <div className="ml-2">
                      <div className="font-semibold">You</div>
                      <div className="text-xs text-gray-400">
                        Playing as {playerColor}
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded bg-gray-700 font-mono ${
                    playerTime < 30 ? 'text-red-500' : ''
                  }`}>
                    {formatTime(playerTime)}
                  </div>
                </div>
              </div>
              
              {/* Game controls */}
              <div className="flex gap-4 mt-4">
                <button 
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors"
                  onClick={handleResign}
                >
                  Resign
                </button>
                <button 
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors"
                  onClick={handleOfferDraw}
                >
                  Offer Draw
                </button>
              </div>
            </div>
            
            {/* Game info section */}
            <div className="lg:w-64">
              <div className="bg-chess-darker p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Game Status</h3>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-sm">{message}</p>
                  {gameId && <p className="text-xs mt-2 text-gray-400">Game ID: {gameId}</p>}
                </div>
                
                {gameState === 'playing' && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Turn:</span>
                      <span>{isPlayerTurn() ? 'Your move' : 'Opponent\'s turn'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Move history section */}
              <div className="bg-chess-darker p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Move History</h3>
                <div className="bg-gray-800 p-3 rounded max-h-64 overflow-y-auto">
                  <div className="mb-1 flex text-sm font-medium">
                    <div className="w-8">#</div>
                    <div className="w-16">White</div>
                    <div className="w-16">Black</div>
                  </div>
                  {moveHistory.length > 0 ? (
                    renderMoveHistory()
                  ) : (
                    <p className="text-sm text-gray-400">No moves yet</p>
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

export default MultiplayerChess;