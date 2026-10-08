/** Shortest time the splash stays up, so it never just flickers past. */
const MIN_VISIBLE_MS = 1200;

/** Same key index.html reads to skip the splash on a refresh. */
const SEEN_KEY = 'campuseats.splashSeen';

/**
 * Fades out the inline splash from index.html. performance.now() counts from
 * page start, so time spent loading the bundle counts towards the minimum.
 * Once shown, it is skipped for the rest of the session (until the app or
 * tab is closed), so refreshing does not replay it.
 */
export function hideSplash(): void {
  const splash = document.getElementById('ce-splash');
  if (!splash) return;

  if (document.documentElement.classList.contains('ce-splash-seen')) {
    splash.remove();
    return;
  }

  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }

  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  setTimeout(() => {
    splash.classList.add('ce-splash--out');
    // Remove after the fade; the timeout covers reduced motion (no transitionend).
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    setTimeout(() => splash.remove(), 600);
  }, wait);
}
