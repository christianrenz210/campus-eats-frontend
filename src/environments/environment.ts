export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  /**
   * Appended to every API call so you can see the designed states on demand:
   *   'delay=3000' -> skeletons   'fail=true' -> error state + retry
   * Clear it (empty string) before you submit.
   */
  simulate: ''
};
