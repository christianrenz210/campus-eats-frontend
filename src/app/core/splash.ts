import { environment } from '../../environments/environment';

/** Shortest time the splash stays up on first open. */
const MIN_VISIBLE_MS = 5000;

/**
 * The Render free tier sleeps when idle and can take up to a minute to wake.
 * Past this, give up waiting and open the app anyway — the menu's own
 * skeletons and error state take over from there.
 */
const MAX_WAIT_MS = 60000;

/** Same key index.html reads to skip the splash on a refresh. */
const SEEN_KEY = 'campuseats.splashSeen';

/**
 * Resolves once the splash is gone (or was skipped on a refresh), so the
 * menu can time its skeleton from the moment the app is actually visible.
 */
let markSplashGone!: () => void;
export const splashGone = new Promise<void>(resolve => { markSplashGone = resolve; });

/** /health sits at the server root, next to /api. */
const HEALTH_URL = environment.apiUrl.replace(/\/api\/?$/, '') + '/health';

/**
 * Resolves once the API answers, or after `ms` either way. Any reply counts:
 * a server that can say no is awake.
 */
function waitForServer(ms: number): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(HEALTH_URL, { cache: 'no-store', signal: controller.signal })
    .then(() => undefined, () => undefined)
    .finally(() => clearTimeout(timer));
}

/**
 * Fades out the inline splash from index.html once the app has started,
 * at least MIN_VISIBLE_MS have passed, and the server is awake.
 * performance.now() counts from page start, so loading the bundle counts
 * towards the minimum. Once shown, it is skipped for the rest of the session
 * (until the app or tab is closed), so refreshing does not replay it.
 */
export async function hideSplash(): Promise<void> {
  const splash = document.getElementById('ce-splash');
  if (!splash || document.documentElement.classList.contains('ce-splash-seen')) {
    splash?.remove();
    markSplashGone();
    return;
  }

  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }

  const minDelay = Math.max(0, MIN_VISIBLE_MS - performance.now());
  let awake = false;
  const server = waitForServer(MAX_WAIT_MS).then(() => { awake = true; });

  // Still asleep after the minimum? Say why it's taking a while.
  const label = splash.querySelector('.ce-splash__label');
  const slowNotice = setTimeout(() => {
    if (!awake && label) label.textContent = 'Connecting to the server…\nThis can take up to a minute.';
  }, minDelay);

  await Promise.all([server, new Promise(resolve => setTimeout(resolve, minDelay))]);
  clearTimeout(slowNotice);

  splash.classList.add('ce-splash--out');
  // Remove after the fade; the timeout covers reduced motion (no transitionend).
  splash.addEventListener('transitionend', () => splash.remove(), { once: true });
  setTimeout(() => splash.remove(), 600);
  markSplashGone();
}
