/**
 * Production Barcode Scanning Service for NEXUS OWNER Platform
 * Handles Hardware USB/Bluetooth HID Wedge scanners, Mobile Camera stream scanning,
 * and programmatic barcode lookup with normalization.
 */

import { barcodeApi, BarcodeLookupResult } from '../api/barcodeApi';
import { Product } from '../types';

export type BarcodeScanHandler = (result: BarcodeLookupResult) => void;
export type BarcodeErrorHandler = (error: Error) => void;

class BarcodeScannerService {
  private scanListeners: Set<BarcodeScanHandler> = new Set();
  private errorListeners: Set<BarcodeErrorHandler> = new Set();
  private wedgeBuffer: string = '';
  private lastKeyTimestamp: number = 0;
  private isWedgeListening: boolean = false;
  private boundKeyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.boundKeyHandler = this.handleKeyDown.bind(this);
    if (typeof window !== 'undefined') {
      this.startHardwareScannerListener();
    }
  }

  /**
   * Listen to hardware USB / Bluetooth barcode scanner inputs.
   * Hardware wedge scanners emulate high-speed keyboard strokes ending in Enter.
   */
  public startHardwareScannerListener(): void {
    if (this.isWedgeListening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.boundKeyHandler);
    this.isWedgeListening = true;
  }

  public stopHardwareScannerListener(): void {
    if (!this.isWedgeListening || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.boundKeyHandler);
    this.isWedgeListening = false;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // If the active element is an input, textarea, or contentEditable, do not hijack unless prefix detected
    const target = e.target as HTMLElement | null;
    const isEditing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    const now = Date.now();
    const timeDelta = now - this.lastKeyTimestamp;
    this.lastKeyTimestamp = now;

    // Keystrokes faster than 50ms typically indicate hardware barcode scanner
    if (e.key === 'Enter') {
      if (this.wedgeBuffer.length >= 4) {
        const scannedCode = this.wedgeBuffer.trim();
        this.wedgeBuffer = '';
        this.processBarcode(scannedCode);
      } else {
        this.wedgeBuffer = '';
      }
      return;
    }

    if (e.key.length === 1) {
      // If time between keystrokes is too long (>100ms) and user is in an input, reset buffer
      if (timeDelta > 100 && !isEditing) {
        this.wedgeBuffer = e.key;
      } else if (timeDelta <= 100) {
        this.wedgeBuffer += e.key;
      } else {
        this.wedgeBuffer = '';
      }
    }
  }

  /**
   * Process and validate scanned or manually entered barcode
   */
  public async processBarcode(code: string): Promise<BarcodeLookupResult> {
    try {
      const sanitized = code.trim().replace(/[\r\n]/g, '');
      const lookupResult = await barcodeApi.lookupBarcode(sanitized);
      this.notifyScan(lookupResult);
      return lookupResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Barcode lookup failed');
      this.notifyError(error);
      throw error;
    }
  }

  public onScan(handler: BarcodeScanHandler): () => void {
    this.scanListeners.add(handler);
    return () => {
      this.scanListeners.delete(handler);
    };
  }

  public onError(handler: BarcodeErrorHandler): () => void {
    this.errorListeners.add(handler);
    return () => {
      this.errorListeners.delete(handler);
    };
  }

  private notifyScan(result: BarcodeLookupResult): void {
    this.scanListeners.forEach(listener => {
      try {
        listener(result);
      } catch (err) {
        console.error('Error in barcode listener:', err);
      }
    });
  }

  private notifyError(error: Error): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in barcode error listener:', err);
      }
    });
  }
}

export const barcodeScanner = new BarcodeScannerService();
