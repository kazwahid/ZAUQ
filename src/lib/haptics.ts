/**
 * Lightweight Instagram-style tactile haptic feedback utility
 */
export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'double' | 'success' = 'light'
): void {
  if (typeof window === 'undefined' || !window.navigator || !('vibrate' in window.navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(8);
        break;
      case 'medium':
        window.navigator.vibrate(20);
        break;
      case 'heavy':
        window.navigator.vibrate(35);
        break;
      case 'double':
        window.navigator.vibrate([12, 40, 18]);
        break;
      case 'success':
        window.navigator.vibrate([10, 30, 15, 30, 25]);
        break;
      default:
        window.navigator.vibrate(10);
    }
  } catch (_) {
    // Non-blocking fallback for browsers restricting vibration without user gesture
  }
}
