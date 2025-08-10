import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, authenticateWithGoogle } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import googleAuthService from "../services/googleAuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleButtonRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize Google OAuth when component mounts
  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        await googleAuthService.initialize();
        
        // Set up credential callback
        googleAuthService.setCredentialCallback(handleGoogleSuccess);
        
        // Render Google button if element exists
        if (googleButtonRef.current) {
          googleAuthService.renderButton('google-signin-button', {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with'
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
      }
    };

    // Delay to ensure DOM is ready
    setTimeout(initializeGoogle, 100);
  }, []);

  // Handle Google sign-in success
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError("");
    
    try {
      const { user } = await authenticateWithGoogle(credentialResponse.credential);
      login(user);
      
      // Role-based redirection
      setTimeout(() => {
        if (user.role === "CUSTOMER") {
          navigate("/customer");
        } else if (user.role === "TRANSPORTER") {
          navigate("/transporter");
        } else if (user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (err) {
      console.error('Google login error:', err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { user } = await loginUser(email, password);
      login(user);
      
      // Role-based redirection with smooth transition
      setTimeout(() => {
        if (user.role === "CUSTOMER") {
          navigate("/customer");
        } else if (user.role === "TRANSPORTER") {
          navigate("/transporter");
        } else if (user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '420px',
      position: 'relative',
      overflow: 'hidden',
      margin: '0 auto',
      border: '1px solid #f3f4f6',
      boxSizing: 'border-box'
    },
    cardDecoration: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      borderRadius: '20px 20px 0 0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '16px',
      color: '#718096',
      fontWeight: '400'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      position: 'relative'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      transition: 'color 0.2s'
    },
    input: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: '#fafafa',
      boxSizing: 'border-box',
      outline: 'none'
    },
    inputFocused: {
      borderColor: '#667eea',
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    passwordContainer: {
      position: 'relative'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '500',
      padding: '4px'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px',
      color: '#dc2626',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    button: {
      width: '100%',
      padding: '16px',
      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    divider: {
      position: 'relative',
      textAlign: 'center',
      margin: '24px 0',
      fontSize: '14px',
      color: '#6b7280'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e5e7eb'
    },
    dividerText: {
      backgroundColor: 'white',
      padding: '0 16px',
      position: 'relative'
    },
    socialButton: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    socialButtonHover: {
      borderColor: '#d1d5db',
      backgroundColor: '#f9fafb',
      transform: 'translateY(-1px)'
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px',
      color: '#6b7280'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={styles.card}>
        {/* <div style={styles.cardDecoration}></div> */}
        
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>


        {/* Google OAuth Button */}
        <div style={{
          width: '100%',
          padding: '0',

          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          backgroundColor: 'white',
          cursor: googleLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          minHeight: '52px',
          position: 'relative',
          overflow: 'hidden'
          
        }}>
          {googleLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              zIndex: 2
            }}>
              <div style={styles.loadingSpinner}></div>
            </div>
          )}
          <div 
            id="google-signin-button" 
            ref={googleButtonRef}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          ></div>
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseOver={(e) => !loading && Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => !loading && Object.assign(e.target.style, styles.button)}
          >
            {loading && <div style={styles.loadingSpinner}></div>}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={styles.link}>
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;