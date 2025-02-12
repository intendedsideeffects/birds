import React from 'react';
import { Bird } from 'lucide-react';

export function BirdLoader() {
  return (
    <div
      className="bird-loader-container"
      aria-label="Loading animation of flying birds">
      <div className="circle">
        {[...Array(8)].map((_, i) => (
          <Bird key={i} style={{color:"black"}} className={`bird bird-${i + 1}`} size={24} />
        ))}
      </div>
      
    </div>
  );
}
