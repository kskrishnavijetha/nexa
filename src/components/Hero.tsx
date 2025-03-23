import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onGetStarted
}) => {
  // This component is no longer used but we're keeping it 
  // to avoid breaking imports elsewhere in the codebase
  return null;
};

export default Hero;
