import { useState } from 'react';
import { SOSButton } from '@/components/SOSButton';
import { ContactRegistration } from '@/components/ContactRegistration';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Phone, Shield } from 'lucide-react';
const Index = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  return <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-emergency" />
          <h1 className="text-4xl font-bold text-foreground">SOS Light</h1>
        </div>
        <p className="text-muted-foreground text-lg">Emergency Alert System for crowded spaces. </p>
      </div>

      {/* Main SOS Button */}
      <div className="mb-12">
        <SOSButton onStateChange={setIsSOSActive} />
      </div>

      {/* Status Indicator */}
      <div className="mb-8">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isSOSActive ? 'bg-emergency animate-pulse' : 'bg-green-500'}`} />
              <span className="font-medium">
                {isSOSActive ? 'SOS Signal Active' : 'System Ready'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Registration */}
      <div className="text-center space-y-4">
        <ContactRegistration />
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Emergency: 112</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Stay Safe</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isSOSActive && <div className="mt-8 max-w-md text-center">
          <Card className="border border-muted">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How to Use</h3>
              <p className="text-sm text-muted-foreground">Press the SOS button to activate emergency flashing. The screen will flash red and white every half second to signal for help. This will help in crowded spaces to get the supporting staff on the right location.

Disclaimer: 

This app doesn't connect directly to the emergency staff. But by using this flashing light the staff will find faster the locations. Every second matter.</p>
            </CardContent>
          </Card>
        </div>}
    </div>;
};
export default Index;