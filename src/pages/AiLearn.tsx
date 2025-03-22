import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const AIOpeningTrainer = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Welcome to AI Opening Trainer! I can help you learn any chess opening system. What would you like to explore today?',
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentOpening, setCurrentOpening] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiModel, setAiModel] = useState('openai');
  const [aiMoveCount, setAiMoveCount] = useState(0);
  const MAX_AUTO_MOVES = 10;  // First 10 moves will be automatic
  const [isAutoPlayPhase, setIsAutoPlayPhase] = useState(true);  // Track if we're in auto-play phase
  
  const messagesEndRef = useRef(null);

  // API Keys - for Vite, use import.meta.env instead of process.env
  const API_KEYS = {
    // Fallback to empty strings if environment variables are not defined
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    groq: import.meta.env.VITE_GROQ_API_KEY || ''
  };

  // For development, you can use hardcoded keys if needed
  // Comment this out before production
  /*
  const API_KEYS = {
    openai: 'sk-your-openai-key-here',
    groq: 'gsk-your-groq-key-here'
  };
  */

  const callAI = async (messagesHistory) => {
    setLoading(true);
    try {
      const systemMessage = {
        role: 'system',
        content: `You are a professional chess coach specializing in opening theory. 
        Current FEN: ${game.fen()}. 
        ${currentOpening ? `Focus on ${currentOpening} opening.` : ''}
        Always provide concise explanations and suggest moves in UCI format when relevant.
        Respond in a clear, instructive manner and suggest the next logical move in the opening.
        If the user is learning an opening system, guide them through each move with explanations.
        If you suggest a move, use algebraic notation in your explanation, but include the UCI format (e.g., e2e4) at the end of your message.
        Current game moves: ${game.history().join(', ')}`
      };

      const payload = {
        model: aiModel === 'groq' ? 'mixtral-8x7b-32768' : 'gpt-3.5-turbo',
        messages: [systemMessage, ...messagesHistory],
        temperature: 0.7,
        max_tokens: 150
      };

      const response = await fetch(
        aiModel === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' :
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEYS[aiModel]}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response from AI service');
      }
      
      const content = data.choices[0].message.content;
      
      // Parse UCI move from response - looking for patterns like e2e4, a7a8q
      const suggestedMove = content.match(/\b([a-h][1-8][a-h][1-8][qrnb]?)\b/i)?.[0]?.toLowerCase();
      
      setLoading(false);
      return { role: 'assistant', content, suggestedMove };
    } catch (error) {
      console.error('AI Error:', error);
      setLoading(false);
      return { 
        role: 'assistant', 
        content: `Error processing request: ${error.message}. Please try again or check your connection.` 
      };
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (move === null) return false;
      
      setPosition(game.fen());
      
      // Only trigger AI response if it's not checkmate or draw
      if (!game.isGameOver()) {
        handleAIResponse();
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAIResponse = async () => {
    if (game.isGameOver()) return; // Don't make AI moves if game is over
    
    const lastMove = game.history().slice(-1)[0] || 'Start position';
    
    const aiResponse = await callAI([...messages, { 
      role: 'user', 
      content: `I made the move: ${lastMove}. What do you think and what should be the response?`
    }]);
    
    setMessages(prev => [...prev, 
      { role: 'user', content: `Made move: ${lastMove}` },
      aiResponse
    ]);

    // Always make AI move if there's a suggested move
    if (aiResponse.suggestedMove && !game.isGameOver()) {
      // Fixed timeout to make the move more visible
      setTimeout(() => {
        const moveSuccess = makeAISuggestedMove(aiResponse.suggestedMove);
        
        if (moveSuccess) {
          if (isAutoPlayPhase) {
            setAiMoveCount(prev => {
              const newCount = prev + 1;
              if (newCount >= MAX_AUTO_MOVES) {
                setIsAutoPlayPhase(false);
              }
              return newCount;
            });
            
            setMessages(prev => [...prev, {
              role: 'system',
              content: aiMoveCount >= MAX_AUTO_MOVES - 1 
                ? `AI played: ${aiResponse.suggestedMove}. Initial moves completed. Now let's continue playing and learning!`
                : `AI played: ${aiResponse.suggestedMove}`
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: 'system',
              content: `AI played: ${aiResponse.suggestedMove}`
            }]);
          }
        } else {
          setMessages(prev => [...prev, {
            role: 'system',
            content: `AI tried to play ${aiResponse.suggestedMove} but it was invalid.`
          }]);
        }
      }, 1000);
    }
  };

  const makeAISuggestedMove = (moveString) => {
    if (!moveString || game.isGameOver()) return false;
    
    try {
      const from = moveString.substring(0, 2);
      const to = moveString.substring(2, 4);
      const promotion = moveString.length > 4 ? moveString.substring(4, 5) : 'q';
      
      const move = game.move({
        from,
        to,
        promotion,
      });

      if (move === null) return false;
      
      setPosition(game.fen());
      return true;
    } catch (error) {
      console.error("Error making suggested move:", error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Check for opening-related commands
    if (inputMessage.toLowerCase().match(/learn|teach/)) {
      const openingMatch = inputMessage.match(/learn\s+([a-z\s']+)/i) || inputMessage.match(/teach\s+([a-z\s']+)/i);
      if (openingMatch && openingMatch[1]) {
        setCurrentOpening(openingMatch[1].trim());
        // Reset board when learning a new opening
        resetBoard();
        
        // We'll handle the AI response in resetBoard
        return;
      }
    }
    
    const aiResponse = await callAI([...messages, userMessage]);
    setMessages(prev => [...prev, aiResponse]);

    // Handle AI suggested moves from chat
    if (aiResponse.suggestedMove && 
      (inputMessage.toLowerCase().includes("make the move") || 
       inputMessage.toLowerCase().includes("play that") ||
       inputMessage.toLowerCase().includes("make that move"))) {
      setTimeout(() => {
        if (makeAISuggestedMove(aiResponse.suggestedMove)) {
          setMessages(prev => [...prev, {
            role: 'system',
            content: `AI played: ${aiResponse.suggestedMove}`
          }]);
        }
      }, 500);
    }
  };

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition('start');
    setAiMoveCount(0);
    setIsAutoPlayPhase(true);  // Reset to auto-play phase
    
    const resetMessage = {
      role: 'system',
      content: `Board reset. ${currentOpening ? `Let's learn the ${currentOpening} opening.` : 'What would you like to learn now?'}`
    };
    
    setMessages(prev => [...prev, resetMessage]);
    
    // If we have a current opening selected, start with AI's first move suggestion
    if (currentOpening) {
      setTimeout(async () => {
        const aiResponse = await callAI([...messages, { 
          role: 'user', 
          content: `Let's start learning the ${currentOpening} opening. What's the first move?`
        }]);
        
        setMessages(prev => [...prev, 
          { role: 'user', content: `Let's start learning the ${currentOpening} opening.` },
          aiResponse
        ]);
        
        if (aiResponse.suggestedMove) {
          setTimeout(() => {
            if (makeAISuggestedMove(aiResponse.suggestedMove)) {
              setMessages(prev => [...prev, {
                role: 'system',
                content: `AI played: ${aiResponse.suggestedMove}`
              }]);
              setAiMoveCount(1);
            }
          }, 1000);
        }
      }, 500);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-900 text-white">
        <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-2">
                <h1 className="text-2xl font-bold text-red-600 text-center">
                AI Opening Trainer
                </h1>
                <p className="text-gray-300 text-center text-xs">
                Learn chess openings with AI guidance
                </p>
            </div>
        </header>
      
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Chess Board Section */}
        <div className="w-full md:w-1/2 p-2 flex flex-col gap-2">
          <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
            <div className="w-full max-w-[400px] mx-auto" style={{ aspectRatio: '1/1', maxHeight: '60vh' }}>
              <Chessboard 
                position={position} 
                onPieceDrop={onDrop}
                boardWidth={400}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h2 className="text-lg font-bold text-red-500 mb-2">Controls</h2>
            <div className="flex gap-2 mb-3">
              <button 
                onClick={resetBoard}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm"
              >
                Reset Board
              </button>
              <button 
                onClick={() => {
                  game.undo();
                  setPosition(game.fen());
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors text-sm"
              >
                Undo Move
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="text-red-500 font-semibold mb-1">Current Opening</h3>
                <p className="bg-gray-700 p-1 rounded">{currentOpening || "None selected"}</p>
              </div>
              
              <div>
                <h3 className="text-red-500 font-semibold mb-1">AI Engine</h3>
                <select 
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-1 focus:ring-1 focus:ring-red-500 text-sm"
                >
                  <option value="openai">OpenAI GPT-3.5</option>
                  <option value="groq">Groq</option>
                </select>
              </div>
              
              <div>
                <h3 className="text-red-500 font-semibold mb-1">Game Status</h3>
                <p className="bg-gray-700 p-1 rounded text-sm">
                  {game.isGameOver() 
                    ? `Game over: ${game.isCheckmate() ? 'Checkmate' : game.isDraw() ? 'Draw' : 'Stalemate'}`
                    : `${game.turn() === 'w' ? 'White' : 'Black'} to move`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Section */}
        <div className="w-full md:w-1/2 p-2 flex flex-col">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 h-half flex flex-col">
            <h2 className="text-lg font-bold text-red-500 mb-2">AI Coach</h2>
            
            <div className="flex-1 overflow-y-auto mb-2 space-y-3 pr-1" style={{ maxHeight: '50vh' }}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-2 rounded ${
                    message.role === 'user' 
                      ? 'bg-red-600/20 border border-red-600/50'
                      : message.role === 'system' 
                        ? 'bg-gray-700 border border-gray-600'
                        : 'bg-gray-700/50 border border-gray-600'
                  }`}>
                    <p className="text-xs md:text-sm">{message.content}</p>
                    {message.role === 'system' && (
                      <p className="text-xs text-gray-400 mt-1">System</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-1 mt-auto">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about openings or moves..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOpeningTrainer;