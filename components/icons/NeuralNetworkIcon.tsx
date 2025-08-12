import React from 'react';

const NeuralNetworkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 60"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <defs>
      <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#4D7BFF' }} /> {/* Cyber Blue */}
        <stop offset="100%" style={{ stopColor: '#00FFFF' }} /> {/* Electric Cyan */}
      </linearGradient>
      <style>
        {`
          .line {
            stroke: url(#line-grad);
            stroke-width: 0.5;
            animation: pulse 2s infinite ease-in-out;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .line-1 { animation-delay: 0s; }
          .line-2 { animation-delay: 0.1s; }
          .line-3 { animation-delay: 0.2s; }
          .line-4 { animation-delay: 0.3s; }
          .line-5 { animation-delay: 0.4s; }
          .line-6 { animation-delay: 0.5s; }
          .line-7 { animation-delay: 0.6s; }
          .line-8 { animation-delay: 0.7s; }
          .line-9 { animation-delay: 0.8s; }
          .node {
            fill: #00FFFF; /* Electric Cyan */
            animation: node-pulse 2s infinite ease-in-out;
             filter: drop-shadow(0 0 2px #00FFFF);
          }
          @keyframes node-pulse {
            0%, 100% { r: 2; opacity: 0.7; }
            50% { r: 2.5; opacity: 1; }
          }
        `}
      </style>
    </defs>
    
    {/* Nodes */}
    <circle className="node" cx="10" cy="10" r="2" style={{animationDelay: '0.1s'}} />
    <circle className="node" cx="10" cy="30" r="2" style={{animationDelay: '0.3s'}} />
    <circle className="node" cx="10" cy="50" r="2" style={{animationDelay: '0.5s'}} />

    <circle className="node" cx="50" cy="5" r="2" style={{animationDelay: '0.2s'}} />
    <circle className="node" cx="50" cy="20" r="2" style={{animationDelay: '0.4s'}} />
    <circle className="node" cx="50" cy="35" r="2" style={{animationDelay: '0.6s'}} />
    <circle className="node" cx="50" cy="50" r="2" style={{animationDelay: '0.8s'}} />
    
    <circle className="node" cx="90" cy="15" r="2" style={{animationDelay: '0.7s'}} />
    <circle className="node" cx="90" cy="45" r="2" style={{animationDelay: '0.9s'}} />

    {/* Lines */}
    <path className="line line-1" d="M10 10 L 50 5"></path>
    <path className="line line-2" d="M10 10 L 50 20"></path>
    <path className="line line-3" d="M10 10 L 50 35"></path>
    
    <path className="line line-4" d="M10 30 L 50 20"></path>
    <path className="line line-5" d="M10 30 L 50 35"></path>
    <path className="line line-6" d="M10 30 L 50 50"></path>

    <path className="line line-7" d="M10 50 L 50 35"></path>
    <path className="line line-8" d="M10 50 L 50 50"></path>

    <path className="line line-5" d="M50 5 L 90 15"></path>
    <path className="line line-6" d="M50 20 L 90 15"></path>
    <path className="line line-7" d="M50 35 L 90 45"></path>
    <path className="line line-8" d="M50 50 L 90 45"></path>
    <path className="line line-9" d="M50 50 L 90 15"></path>
  </svg>
);

export default NeuralNetworkIcon;