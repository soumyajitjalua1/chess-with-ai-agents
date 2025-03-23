# AI Chess Arena

AI Chess Arena is a comprehensive chess platform that leverages AI to help players of all levels improve their game. The platform combines traditional chess gameplay with advanced AI analysis, learning resources, and multiplayer capabilities.

![AI Chess Arena Logo](https://github.com/soumyajitjalua1/chess-with-ai-agents/blob/main/Screenshot%202025-03-22%20231827.png)

## Features

### 🔍 In-Game Analysis
- Real-time position evaluation using Groq API
- AI agents that detect and analyze the current position
- Suggestions for optimal moves with explanations
- Material evaluation and check detection
- Board control assessment

  ![Ai Move](https://github.com/soumyajitjalua1/chess-with-ai-agents/blob/main/Screenshot%202025-03-23%20140124.png)

### 📚 Learning Center
- **Master Level Tactics**: 10 predefined tactical scenarios with board visualization
- **AI-Assisted Learning**: Play and chat with AI to improve your skills
- **Endgame Tactics**: 10 predefined endgame scenarios to master closing positions
  ![Lerning](https://github.com/soumyajitjalua1/chess-with-ai-agents/blob/main/Screenshot%202025-03-23%20140214.png)

### 🏆 Leaderboard
- Track player rankings
- Display achievements and progress
- Performance statistics

  ![Leaderbord](https://github.com/soumyajitjalua1/chess-with-ai-agents/blob/main/Screenshot%202025-03-23%20140512.png)

### ♟️ Game Modes

#### Classical Chess
- Adjustable difficulty levels
- Choose your color (white/black)
- Customizable time controls
- Full board visualization

#### AI Challenge
- Three AI opponent types:
  - Basic: For beginners
  - Tactical: For intermediate players
  - Advanced: For experienced players
- Play as white or black
- Multiple time control options (5/10/15 minutes)

#### Multiplayer
- Real-time matches with players worldwide
- WebSocket implementation for seamless connectivity
- Chat functionality during games

## Technology Stack

- Frontend: React.js with TypeScript
- Backend: Node.js, Express
- AI Integration: Groq API for chess analysis
- Real-time Communication: WebSockets
- Chess Engine: Stockfish (customized)
- Authentication: JWT
- Database: MongoDB

## Installation

```bash
# Clone the repository
git clone https://github.com/soumyajitjalua1/chess-with-ai-agents.git

# Navigate to the project directory
cd ai-chess-arena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start the development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```

## Usage

1. Register or log in to your account
2. Navigate to the desired game mode or learning resource
3. For analysis, make a move and the AI will provide feedback
4. For learning, select a tactic or engage with the AI tutor
5. For multiplayer, wait for an opponent or invite a friend

## API Documentation

The API endpoints are documented using Swagger and can be accessed at `/api-docs` when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Mobile application
- [ ] Tournament mode
- [ ] Video tutorials
- [ ] Opening book trainer
- [ ] Puzzle of the day
- [ ] Social sharing features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Groq](https://groq.com/) for their powerful AI API
- [Stockfish](https://stockfishchess.org/) chess engine
- The open-source chess community for inspiration and resources

## Contact

Soumyajit Jalua - [@Soumyajitjalua](https://x.com/Soumyajitjalua) - Soumyajitjalua@gmail.com

Project Link: [https://github.com/yourusername/ai-chess-arena](https://github.com/soumyajitjalua1/chess-with-ai-agents)
