import { createRequire } from 'module';

const require = createRequire(import.meta.url);
export const girirajData = require('../test-data/giriraj-data.json');

/**
 * Returns complete Giriraj Digital test data configuration
 * @returns {typeof girirajData}
 */
export function getGirirajData() {
  return girirajData;
}

/**
 * Returns specific route URL by key
 * @param {keyof typeof girirajData.routes} routeKey
 * @returns {string}
 */
export function getRoute(routeKey) {
  const route = girirajData.routes[routeKey];
  if (!route) {
    throw new Error(`Route key "${routeKey}" was not found in test-data/giriraj-data.json`);
  }
  return route;
}

/**
 * Returns contact form test data and expected validation messages
 */
export function getContactFormData() {
  return girirajData.contactForm;
}
