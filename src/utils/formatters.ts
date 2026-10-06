/**
 * Utility formatters for Indian commercial numbers, currency, and timestamps
 */

export function formatINR(val: number, includeDecimals = false): string {
  if (isNaN(val)) return '₹0';
  
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // Indian number grouping system: first 3 digits, then pairs of 2 digits
  const parts = absVal.toFixed(includeDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return `${isNegative ? '-' : ''}₹${integerPart}${decimalPart}`;
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  const parts = Math.abs(val).toString().split('.');
  let integerPart = parts[0];
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return `${val < 0 ? '-' : ''}${integerPart}`;
}

export function formatPercent(val: number): string {
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
