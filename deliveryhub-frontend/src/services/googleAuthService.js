const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';


class GoogleAuthService {
  constructor() {
    this.isInitialized = false;
    this.initPromise = null;
  }

  // Initialize Google OAuth
    async initialize() {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      // Wait for Google script to load
      const checkGoogleLoaded = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
          });
          this.isInitialized = true;
          resolve();
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      
      checkGoogleLoaded();
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Google OAuth failed to initialize'));
        }
      }, 10000);
    });

    return this.initPromise;
  }

  // Handle the credential response from Google
  handleCredentialResponse(response) {
    // This will be called when user completes OAuth
    // We'll handle the token here
    console.log('Google credential response:', response);
    
    // Store the callback for custom handling
    if (this.onCredentialCallback) {
      this.onCredentialCallback(response);
    }
  }

  // Set custom callback for handling credentials
  setCredentialCallback(callback) {
    this.onCredentialCallback = callback;
  }

  // Render Google Sign-In button
  async renderButton(elementId, options = {}) {
    await this.initialize();
    
    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%'
    };

    const buttonOptions = { ...defaultOptions, ...options };

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      buttonOptions
    );
  }

  // Programmatic sign-in (popup)
  async signIn() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      // Set temporary callback
      const originalCallback = this.onCredentialCallback;
      this.onCredentialCallback = (response) => {
        // Restore original callback
        this.onCredentialCallback = originalCallback;
        resolve(response);
      };

      // Trigger the sign-in prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if prompt doesn't show
          this.showPopup().then(resolve).catch(reject);
        }
      });
    });
  }

  // Show OAuth popup
  async showPopup() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      });
      
      client.requestAccessToken();
    });
  }

  // Decode JWT token to get user info
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Get user profile from Google token
  async getUserProfile(credential) {
    try {
      const userInfo = this.decodeJWT(credential);
      
      return {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        picture: userInfo.picture,
        emailVerified: userInfo.email_verified
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile from Google');
    }
  }

  // Sign out
  signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

// Export singleton instance
const googleAuthService = new GoogleAuthService();
export default googleAuthService;