import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tickoff.app',
  appName: 'TickOff',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'TickOff'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0ea5e9",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config; 