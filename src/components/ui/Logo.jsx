export default function Logo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 400 150" 
      className={`${className} transition-colors duration-300`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Bracket */}
      <path 
        d="M 60 45 L 30 75 L 60 105" 
        fill="none" 
        stroke="currentColor" 
        className="text-indigo-500" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Right Bracket */}
      <path 
        d="M 140 45 L 170 75 L 140 105" 
        fill="none" 
        stroke="currentColor" 
        className="text-indigo-500" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Letter J Monogram */}
      <path 
        d="M 110 40 L 110 90 C 110 105 90 105 85 95" 
        fill="none" 
        stroke="currentColor" 
        className="text-gray-900 dark:text-white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Typography */}
      <text 
        x="200" 
        y="90" 
        fontFamily="Space Grotesk, sans-serif" 
        fontSize="42" 
        fontWeight="800" 
        fill="currentColor" 
        className="text-gray-900 dark:text-white font-heading"
      >
        Junaid.
      </text>
    </svg>
  );
}
