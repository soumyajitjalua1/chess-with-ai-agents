import React, { useState, useEffect } from 'react';

const UnderConstructionPage = () => {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Animated Dot Loader */}
      <div className="container mb-12" style={{ '--uib-color': '#3B82F6', '--uib-size': '120px' } as React.CSSProperties}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="dot" />
        ))}
      </div>

      {/* Content */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-6 animate-pulse">
          Under Construction!
        </h1>
        
        <div className="text-xl text-gray-300 mb-8">
          <p className="mb-4">We're building something amazing for you!</p>
          <p className="text-blue-300 font-semibold">
            Loading{'.'.repeat(dots)}
          </p>
        </div>

        <a
          href="/"
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Return to Homepage
        </a>

        {/* Footer */}
        <p className="mt-12 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>

      <style>{`
        .container {
          --uib-speed: 1.5s;
          --uib-dot-size: calc(var(--uib-size) * 0.1);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: calc(var(--uib-size) * 0.64);
          width: calc(var(--uib-size) * 0.64);
        }

        @keyframes jump {
          0%,
          100% {
            transform: translateY(120%);
          }
          50% {
            transform: translateY(-120%);
          }
        }

        .dot {
          --uib-d1: -0.48;
          --uib-d2: -0.4;
          --uib-d3: -0.32;
          --uib-d4: -0.24;
          --uib-d5: -0.16;
          --uib-d6: -0.08;
          --uib-d7: -0;
          position: absolute;
          bottom: calc(var(--uib-bottom) + var(--uib-dot-size) / 2);
          right: calc(var(--uib-right) + var(--uib-dot-size) / 2);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: var(--uib-dot-size);
          width: var(--uib-dot-size);
          animation: jump var(--uib-speed) ease-in-out infinite;
          opacity: var(--uib-scale);
        }

        .dot::before {
          content: '';
          height: 100%;
          width: 100%;
          background-color: var(--uib-color);
          border-radius: 50%;
          transform: scale(var(--uib-scale));
          transition: background-color 0.3s ease;
        }

        /* Dot positions and animations */
        .dot:nth-child(1) { --uib-bottom: 24%; --uib-right: -35%; animation-delay: calc(var(--uib-speed) * var(--uib-d1)); }
        .dot:nth-child(2) { --uib-bottom: 16%; --uib-right: -6%; animation-delay: calc(var(--uib-speed) * var(--uib-d2)); }
        .dot:nth-child(3) { --uib-bottom: 8%; --uib-right: 23%; animation-delay: calc(var(--uib-speed) * var(--uib-d3)); }
        .dot:nth-child(4) { --uib-bottom: -1%; --uib-right: 51%; animation-delay: calc(var(--uib-speed) * var(--uib-d4)); }
        .dot:nth-child(5) { --uib-bottom: 38%; --uib-right: -17.5%; animation-delay: calc(var(--uib-speed) * var(--uib-d2)); }
        .dot:nth-child(6) { --uib-bottom: 30%; --uib-right: 10%; animation-delay: calc(var(--uib-speed) * var(--uib-d3)); }
        .dot:nth-child(7) { --uib-bottom: 22%; --uib-right: 39%; animation-delay: calc(var(--uib-speed) * var(--uib-d4)); }
        .dot:nth-child(8) { --uib-bottom: 14%; --uib-right: 67%; animation-delay: calc(var(--uib-speed) * var(--uib-d5)); }
        .dot:nth-child(9) { --uib-bottom: 53%; --uib-right: -0.8%; animation-delay: calc(var(--uib-speed) * var(--uib-d3)); }
        .dot:nth-child(10) { --uib-bottom: 44.5%; --uib-right: 27%; animation-delay: calc(var(--uib-speed) * var(--uib-d4)); }
        .dot:nth-child(11) { --uib-bottom: 36%; --uib-right: 55.7%; animation-delay: calc(var(--uib-speed) * var(--uib-d5)); }
        .dot:nth-child(12) { --uib-bottom: 28.7%; --uib-right: 84.3%; animation-delay: calc(var(--uib-speed) * var(--uib-d6)); }
        .dot:nth-child(13) { --uib-bottom: 66.8%; --uib-right: 15%; animation-delay: calc(var(--uib-speed) * var(--uib-d4)); }
        .dot:nth-child(14) { --uib-bottom: 58.8%; --uib-right: 43%; animation-delay: calc(var(--uib-speed) * var(--uib-d5)); }
        .dot:nth-child(15) { --uib-bottom: 50%; --uib-right: 72%; animation-delay: calc(var(--uib-speed) * var(--uib-d6)); }
        .dot:nth-child(16) { --uib-bottom: 42%; --uib-right: 100%; animation-delay: calc(var(--uib-speed) * var(--uib-d7)); }

        /* Dot scaling */
        .dot:nth-child(3) { --uib-scale: 0.98; }
        .dot:nth-child(2), .dot:nth-child(8) { --uib-scale: 0.96; }
        .dot:nth-child(1), .dot:nth-child(7) { --uib-scale: 0.94; }
        .dot:nth-child(6), .dot:nth-child(12) { --uib-scale: 0.92; }
        .dot:nth-child(5), .dot:nth-child(11) { --uib-scale: 0.9; }
        .dot:nth-child(10), .dot:nth-child(16) { --uib-scale: 0.88; }
        .dot:nth-child(9), .dot:nth-child(15) { --uib-scale: 0.86; }
        .dot:nth-child(14) { --uib-scale: 0.84; }
        .dot:nth-child(13) { --uib-scale: 0.82; }
      `}</style>
    </div>
  );
};

export default UnderConstructionPage;