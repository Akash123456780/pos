/**
 * Production Token Manager for NEXUS OWNER Platform
 * Manages short-lived in-memory access tokens with sessionStorage fallback.
 * Designed with adapter hooks for Capacitor Secure Storage / Android KeyStore.
 */

class TokenManagerImpl {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;
  private readonly ACCESS_TOKEN_KEY = 'nx_sec_access_token';
  private readonly REFRESH_TOKEN_KEY = 'nx_sec_refresh_token';

  constructor() {
    // Attempt rehydration from sessionStorage (cleared when browser session ends)
    try {
      this.inMemoryAccessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.inMemoryRefreshToken = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      // Storage unavailable or blocked
    }
  }

  public getAccessToken(): string | null {
    return this.inMemoryAccessToken;
  }

  public getRefreshToken(): string | null {
    return this.inMemoryRefreshToken;
  }

  public setTokens(accessToken: string, refreshToken?: string): void {
    this.inMemoryAccessToken = accessToken;
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        this.inMemoryRefreshToken = refreshToken;
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch {
      // Ignore if sessionStorage restricted
    }
  }

  public clearTokens(): void {
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch {
      // Ignore
    }
  }

  public hasValidAccessToken(): boolean {
    return Boolean(this.inMemoryAccessToken);
  }
}

export const TokenManager = new TokenManagerImpl();
