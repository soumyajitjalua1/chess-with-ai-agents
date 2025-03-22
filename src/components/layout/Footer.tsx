
import { Link } from 'react-router-dom';
import { Twitter, Github, Youtube, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-chess-dark py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="text-left">
            <Link to="/" className="flex items-center mb-4">
              <div className="w-8 h-8 mr-2 bg-chess-red rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">♟</span>
              </div>
              <span className="text-white font-bold text-xl">AI Chess Arena</span>
            </Link>
            <p className="text-gray-400 text-sm">
              The future of chess is here. Challenge our advanced AI opponents or face players worldwide in our futuristic chess battleground.
            </p>
          </div>
          
          <div className="text-left">
            <h3 className="text-white font-medium mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/forums" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Forums
                </Link>
              </li>
              <li>
                <Link to="/discord" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Discord Server
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-development" className="text-gray-400 hover:text-white text-sm transition-colors">
                  AI Development
                </Link>
              </li>
              <li>
                <Link to="/chess-guides" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Chess Guides
                </Link>
              </li>
              <li>
                <Link to="/api-access" className="text-gray-400 hover:text-white text-sm transition-colors">
                  API Access
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="text-white font-medium mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/Soumyajitjalua" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com/soumyajitjalua1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61556806895133" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/soumyajitjalua/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/soumyajit-jalua-09a98a270/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-6">
              © 2025 AI Chess Arena. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
