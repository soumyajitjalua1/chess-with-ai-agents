
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Learn', path: '/learn' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-chess-dark/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 mr-2 bg-chess-red rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">♟</span>
              </div>
              <span className="text-white font-bold text-xl">AI Chess Arena</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
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
              <Link
                to="/play"
                className="button-primary animate-glow"
              >
                Play
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } md:hidden fixed inset-0 bg-chess-dark/95 backdrop-blur-lg transition-all duration-300 ease-in-out z-50 pt-16`}
      >
        <div className="px-4 pt-4 pb-8 space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center justify-between text-white hover:text-chess-red py-2 px-3 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
            >
              <span className="text-lg font-medium">{item.name}</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          ))}
          <div className="pt-6">
            <Link
              to="/play"
              className="button-primary w-full inline-block text-center"
              onClick={toggleMenu}
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
