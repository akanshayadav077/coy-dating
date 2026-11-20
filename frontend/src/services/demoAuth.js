export const DEMO_OTP = '123456';
export const OTP_LENGTH = DEMO_OTP.length;
export const RESEND_SECONDS = 30;

const SESSION_KEY = 'coy-discover-session';

export const isOtpCorrect = (code) => code === DEMO_OTP;

export const session = {
  isActive() {
    try {
      return localStorage.getItem(SESSION_KEY) === 'active';
    } catch {
      return false;
    }
  },
  start() {
    try {
      localStorage.setItem(SESSION_KEY, 'active');
    } catch {
      /* private mode: the session simply lasts until reload */
    }
  },
  clear() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing to clear */
    }
  },
};
