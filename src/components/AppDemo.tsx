import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Phone, Wifi, Battery, Signal } from 'lucide-react';

export const AppDemo = () => {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    if (isDemoActive) {
      const interval = setInterval(() => {
        setDemoStep((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 2000);
      
      const timeout = setTimeout(() => {
        setIsDemoActive(false);
        setDemoStep(0);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isDemoActive]);

  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800">
        <CardContent className="p-0">
          {/* Phone Mockup */}
          <div className="aspect-[9/16] bg-black relative max-w-sm mx-auto p-2">
            {/* Phone Frame */}
            <div className="w-full h-full bg-white rounded-3xl relative overflow-hidden">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 py-2 bg-background text-xs">
                <span className="font-medium">09:41</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* App Content */}
              <div 
                className={cn(
                  "flex-1 px-6 py-8 h-full transition-all duration-300",
                  isDemoActive && demoStep % 2 === 0 && "bg-emergency",
                  isDemoActive && demoStep % 2 === 1 && "bg-safe"
                )}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className={cn(
                    "text-xl font-bold transition-colors",
                    isDemoActive ? "text-emergency-foreground" : "text-foreground"
                  )}>
                    Festival SOS Light
                  </h1>
                  <p className={cn(
                    "text-sm mt-2 transition-colors",
                    isDemoActive ? "text-emergency-foreground/80" : "text-muted-foreground"
                  )}>
                    Noodhulp voor evenementen
                  </p>
                </div>

                {/* Status Card */}
                <Card className="mb-8">
                  <CardContent className="p-4 text-center">
                    <Badge 
                      variant={isDemoActive ? "destructive" : "secondary"}
                      className="mb-2"
                    >
                      {isDemoActive ? "SOS ACTIEF" : "SYSTEEM GEREED"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {isDemoActive 
                        ? "Hulpverleners kunnen je zien!" 
                        : "Druk op SOS als je hulp nodig hebt"
                      }
                    </p>
                  </CardContent>
                </Card>

                {/* SOS Button */}
                <div className="flex justify-center mb-8">
                  <Button
                    className={cn(
                      "w-32 h-32 rounded-full text-lg font-bold transition-all",
                      isDemoActive
                        ? "bg-white text-emergency border-4 border-white shadow-2xl animate-pulse"
                        : "bg-emergency text-emergency-foreground hover:bg-emergency/90 border-4 border-emergency"
                    )}
                    disabled
                  >
                    {isDemoActive ? 'Stop SOS' : 'Start SOS'}
                  </Button>
                </div>

                {/* Instructions */}
                {!isDemoActive && (
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                      • Hou je telefoon omhoog voor maximale zichtbaarheid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      • Het flashende signaal is van veraf zichtbaar
                    </p>
                  </div>
                )}

                {isDemoActive && (
                  <div className="text-center">
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      "text-emergency-foreground"
                    )}>
                      ⚡ NOODSIGNAAL ACTIEF ⚡
                    </p>
                    <p className={cn(
                      "text-xs mt-1 transition-colors",
                      "text-emergency-foreground/80"
                    )}>
                      Hulpverleners kunnen je nu lokaliseren
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demo Controls */}
          <div className="p-6 text-center bg-slate-800">
            <h3 className="text-xl font-semibold text-white mb-2">
              Interactieve Demo
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Zie hoe de SOS functionaliteit werkt
            </p>
            <Button 
              onClick={startDemo}
              disabled={isDemoActive}
              className="bg-emergency text-emergency-foreground hover:bg-emergency/90"
            >
              {isDemoActive ? 'Demo Actief...' : 'Start Demo'}
            </Button>
            
            {isDemoActive && (
              <div className="mt-4 text-xs text-slate-400">
                {demoStep === 0 && "▶ SOS geactiveerd - scherm begint te flitsen"}
                {demoStep === 1 && "▶ Rood-wit flashend signaal is zichtbaar"}
                {demoStep === 2 && "▶ Hulpverleners zien je locatie"}
                {demoStep === 3 && "▶ Signaal blijft actief tot je stopt"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};