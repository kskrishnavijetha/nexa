
import React from 'react';
import HeroContent from './hero/HeroContent';

const Hero: React.FC = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-0 w-60 h-60 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
      
      <HeroContent />
    </div>
  );
};

export default Hero;
