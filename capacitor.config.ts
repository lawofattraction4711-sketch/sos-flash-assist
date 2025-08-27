import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d8bc9cd1f60c4c50a24e97cf5b2c5dc6',
  appName: 'sos-flash-assist',
  webDir: 'dist',
  server: {
    url: 'https://d8bc9cd1-f60c-4c50-a24e-97cf5b2c5dc6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;