import IdentityManager from '@arcgis/core/identity/IdentityManager.js';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo.js';
import Portal from '@arcgis/core/portal/Portal.js';
import axios from 'axios';

const serverUrl = 'https://www.arcgis.com/sharing/rest';

/**
 * Register token and server URL
 * with the IdentityManager
 * @param token
 * @returns void
 */
export const initialize = (token) => {
  IdentityManager.registerToken({
    server: 'https://services.arcgis.com/',
    token: token,
  });
};

/**
 * Check current logged in status for current portal
 * @returns Promise<void>
 */
export const checkCurrentStatus = async () => {
  try {
    const credential = await IdentityManager.checkSignInStatus(`${serverUrl}`);
    return credential;
  } catch (error) {
    console.warn(error);
  }
};

/**
 * Attempt to sign in,
 * first check current status
 * if not signed in, then go through
 * steps to get credentials
 * @returns Promise<`esri/identity/Credential`>
 */
export const signIn = async () => {
  try {
    const credential = await checkCurrentStatus() || await fetchCredentials();
    return credential;
  } catch (error) {
    const credential = await fetchCredentials();
    return credential;
  }
};
/**
 * Sign the user out, but if we checked credentials
 * manually, make sure they are registered with
 * IdentityManager, so it can destroy them properly
 * @returns Promise<void>
 */
export const signOut = async () => {
    IdentityManager.destroyCredentials();
    window.location.reload();
};

/**
 * Get the credentials for the provided portal
 * @returns Promise<`esri/identity/Credential`>
 */
export const fetchCredentials = async () => {
  try {
    const credential = await IdentityManager.getCredential(`${serverUrl}`);
    return credential;
  } catch (error) {
    console.warn(error);
  }
};


export const fetchUser = async (token) => {
  const response = await axios.get(`https://www.arcgis.com/sharing/rest/community/self?f=json&token=${token}`);
  return response.data;
};
export const fetchPortal = async () => {
    const portal = new Portal();
    await portal.load();
    return portal;
};