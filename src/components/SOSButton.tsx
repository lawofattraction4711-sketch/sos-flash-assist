import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  onStateChange?: (isActive: boolean) => void;
}

export const SOSButton = ({ onStateChange }: SOSButtonProps) => {
  const [isSOSActive, setIsSOSActive] = useState(false);

  const toggleSOS = () => {
    const newState = !isSOSActive;
    setIsSOSActive(newState);
    onStateChange?.(newState);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSOSActive) {
      // Flash screen every 500ms
      document.body.classList.add('sos-flash-emergency');
    } else {
      // Reset to safe background
      document.body.classList.remove('sos-flash-emergency');
      document.body.classList.add('sos-flash-safe');
      
      // Remove safe class after animation
      setTimeout(() => {
        document.body.classList.remove('sos-flash-safe');
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSOSActive]);

  return (
    <Button
      onClick={toggleSOS}
      className={cn(
        "emergency-button",
        isSOSActive && "emergency-button-active"
      )}
      size="lg"
    >
      {isSOSActive ? 'Stop SOS' : 'Start SOS'}
    </Button>
  );
};