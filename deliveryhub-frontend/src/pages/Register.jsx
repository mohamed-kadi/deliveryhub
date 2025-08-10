import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, authenticateWithGoogle } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import googleAuthService from "../services/googleAuthService";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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
          googleAuthService.renderButton('google-register-button', {
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

  // // Handle Google OAuth success for registration
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   setGoogleLoading(true);
  //   setError("");
    
  //   try {
  //     await registerWithGoogle(credentialResponse.credential, form.role);
  //     setSuccess("Registration successful! Redirecting to login...");
  //     setTimeout(() => navigate("/login"), 2000);
  //   } catch (err) {
  //     console.error('Google registration error:', err);
  //     setError("Google sign-up failed. Please try again.");
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

const handleGoogleSuccess = async (credentialResponse) => {
  setGoogleLoading(true);
  setError("");
  
  try {
    console.log('🔍 Google credential received:', credentialResponse);
    
    // Get fresh state by using a callback
    setForm(currentForm => {
      console.log('🔍 FRESH form state:', currentForm);
      console.log('🔍 FRESH role from form:', currentForm.role);
      
      // Use the fresh state for authentication
      authenticateWithGoogle(credentialResponse.credential, currentForm.role)
        .then(({ user }) => {
          console.log('🔍 User created with role:', user.role);
          login(user);
          
          setTimeout(() => {
            if (user.role === "CUSTOMER") {
              navigate("/customer");
            } else if (user.role === "TRANSPORTER") {
              navigate("/transporter");
            } else {
              navigate("/dashboard");
            }
          }, 500);
        })
        .catch((err) => {
          console.error('Google registration error:', err);
          setError("Google sign-up failed. Please try again.");
        })
        .finally(() => {
          setGoogleLoading(false);
        });
      
      // Return the same state (no change needed)
      return currentForm;
    });
    
  } catch (err) {
    console.error('Google registration error:', err);
    setError("Google sign-up failed. Please try again.");
    setGoogleLoading(false);
  }
};

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role
      });
      
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "#ef4444";
    if (passwordStrength <= 2) return "#f97316";
    if (passwordStrength <= 3) return "#eab308";
    if (passwordStrength <= 4) return "#22c55e";
    return "#16a34a";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '480px',
      position: 'relative',
      overflow: 'hidden'
    },
    cardDecoration: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
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
      gap: '20px'
    },
    inputGroup: {
      position: 'relative'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
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
    select: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      backgroundColor: '#fafafa',
      boxSizing: 'border-box',
      outline: 'none',
      cursor: 'pointer'
    },
    roleContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    roleOption: {
      padding: '20px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fafafa'
    },
    roleOptionSelected: {
      borderColor: '#667eea',
      backgroundColor: '#f0f4ff',
      color: '#667eea'
    },
    roleIcon: {
      fontSize: '24px',
      marginBottom: '8px'
    },
    roleTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px'
    },
    roleDesc: {
      fontSize: '12px',
      color: '#6b7280'
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
    passwordStrength: {
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    strengthBar: {
      flex: 1,
      height: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    strengthFill: {
      height: '100%',
      backgroundColor: getPasswordStrengthColor(),
      width: `${(passwordStrength / 5) * 100}%`,
      transition: 'all 0.3s ease'
    },
    strengthText: {
      fontSize: '12px',
      fontWeight: '500',
      color: getPasswordStrengthColor()
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
    success: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '12px',
      color: '#16a34a',
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
      marginTop: '8px'
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
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join our delivery platform today</p>
        </div>
        {/* Google OAuth Button - Use NATIVE Google button */}
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
            id="google-register-button" 
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
          <span style={styles.dividerText}>or sign up with email</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Enter your phone number"
              required
            />
          </div>

<div style={styles.inputGroup}>
  <label style={styles.label}>I want to...</label>
  
  {/* Debug display */}
  <div style={{color: 'red', fontSize: '14px', marginBottom: '10px'}}>
    DEBUG: Current role = {form.role}
  </div>
  
  <div style={styles.roleContainer}>
    <div
      style={{
        ...styles.roleOption,
        ...(form.role === 'CUSTOMER' ? styles.roleOptionSelected : {})
      }}
      onClick={() => {
        console.log('🔍 Customer clicked, setting role to CUSTOMER');
        setForm({
          ...form,
          role: 'CUSTOMER'
        });
      }}
    >
      <div style={styles.roleIcon}>📦</div>
      <div style={styles.roleTitle}>Send Packages</div>
      <div style={styles.roleDesc}>I need delivery services</div>
    </div>
    <div
      style={{
        ...styles.roleOption,
        ...(form.role === 'TRANSPORTER' ? styles.roleOptionSelected : {})
      }}
      onClick={() => {
        console.log('🔍 Transporter clicked, setting role to TRANSPORTER');
        setForm({
          ...form,
          role: 'TRANSPORTER'
        });
      }}
    >
      <div style={styles.roleIcon}>🚚</div>
      <div style={styles.roleTitle}>Deliver Packages</div>
      <div style={styles.roleDesc}>I want to earn money</div>
    </div>
  </div>
</div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Create a strong password"
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
            {form.password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthBar}>
                  <div style={styles.strengthFill}></div>
                </div>
                <span style={styles.strengthText}>{getPasswordStrengthText()}</span>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && (
            <div style={styles.error}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              <span>✅</span>
              {success}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?
          <Link to="/login" style={styles.link}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;