/**
 * Capacitor Configuration for NEXUS OWNER Mobile Application
 * Used when packaging the progressive web app as an Android APK/AAB or iOS App.
 *
 * Packaging workflow:
 *   1. npm run build
 *   2. npx cap add android
 *   3. npx cap sync
 *   4. npx cap open android
 */

export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
  };
  android?: {
    allowMixedContent?: boolean;
    captureInput?: boolean;
    webContentsDebuggingEnabled?: boolean;
  };
}

const config: CapacitorConfig = {
  appId: 'in.nexuspos.owner',
  appName: 'NEXUS OWNER',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
