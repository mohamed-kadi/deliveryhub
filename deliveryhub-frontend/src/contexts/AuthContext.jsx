// import React, { createContext, useState, useEffect, useContext } from "react";
// import { getAccessToken, getRefreshToken, refreshAccessToken, clearTokens } from "../services/authService";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check if user is authenticated on app start
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const accessToken = getAccessToken();
//       const refreshToken = getRefreshToken();
      
//       if (accessToken && refreshToken) {
//         // Try to refresh token to verify it's still valid
//         try {
//           await refreshAccessToken();
//           setIsAuthenticated(true);
//           // You could decode the token here to get user info if needed
//         } catch (error) {
//           console.error("Token refresh failed on init:", error);
//           clearTokens();
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     clearTokens();
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       setUser, 
//       isAuthenticated, 
//       loading,
//       login, 
//       logout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for using auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// first copy past 
// import React, { createContext, useState, useEffect, useContext } from "react";
// import { getAccessToken, getRefreshToken, refreshAccessToken, clearTokens } from "../services/authService";
// import apiClient from "../services/apiClient";

// export const AuthContext = createContext();

// // Helper function to decode JWT token
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch user details from backend
//   const fetchUserDetails = async () => {
//     try {
//       const response = await apiClient.get('/users/me');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       return null;
//     }
//   };

//   // Check if user is authenticated on app start
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const accessToken = getAccessToken();
//       const refreshToken = getRefreshToken();
      
//       if (accessToken && refreshToken) {
//         try {
//           // First, try to refresh token to ensure it's valid
//           await refreshAccessToken();
          
//           // Fetch full user details from backend
//           const userDetails = await fetchUserDetails();
          
//           if (userDetails) {
//             setUser({
//               id: userDetails.id,
//               email: userDetails.email,
//               fullName: userDetails.fullName,
//               phone: userDetails.phone,
//               role: userDetails.role,
//               verified: userDetails.verified
//             });
//             setIsAuthenticated(true);
//           } else {
//             // If can't fetch user details, clear auth
//             console.error("Could not fetch user details");
//             clearTokens();
//             setIsAuthenticated(false);
//           }
//         } catch (error) {
//           console.error("Auth initialization failed:", error);
//           clearTokens();
//           setIsAuthenticated(false);
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   const login = async (userData) => {
//     // If userData doesn't include all needed fields, fetch them
//     if (!userData.id || !userData.fullName) {
//       try {
//         const userDetails = await fetchUserDetails();
//         if (userDetails) {
//           userData = userDetails;
//         }
//       } catch (error) {
//         console.error("Could not fetch complete user details after login:", error);
//       }
//     }
    
//     setUser({
//       id: userData.id,
//       email: userData.email,
//       fullName: userData.fullName,
//       phone: userData.phone,
//       role: userData.role,
//       verified: userData.verified
//     });
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     clearTokens();
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       setUser, 
//       isAuthenticated, 
//       loading,
//       login, 
//       logout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for using auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };
//************************************* */

// second copy paste 
import React, { createContext, useState, useEffect, useContext } from "react";
import { getAccessToken, getRefreshToken, refreshAccessToken, clearTokens } from "../services/authService";
import apiClient from "../services/apiClient";

export const AuthContext = createContext();

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user details from backend
  const fetchUserDetails = async () => {
    try {
      console.log('📡 Fetching user details from /api/users/me...');
      const response = await apiClient.get('/users/me');
      console.log('✅ User details fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      return null;
    }
  };

  // Check if user is authenticated on app start
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Starting auth initialization...');
      
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      
      console.log('🔍 Tokens found:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length,
        refreshTokenLength: refreshToken?.length
      });
      
      if (accessToken && refreshToken) {
        try {
          // First, try to refresh token to ensure it's valid
          console.log('🔄 Attempting to refresh token...');
          const newAccessToken = await refreshAccessToken();
          console.log('✅ Token refreshed successfully');
          
          // Fetch full user details from backend
          const userDetails = await fetchUserDetails();
          
          if (userDetails) {
            const userData = {
              id: userDetails.id,
              email: userDetails.email,
              fullName: userDetails.fullName,
              phone: userDetails.phone,
              role: userDetails.role,
              verified: userDetails.verified
            };
            console.log('✅ Setting user data:', userData);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.error("❌ Could not fetch user details");
            clearTokens();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          clearTokens();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('⚠️ No tokens found, user not authenticated');
      }
      
      console.log('🏁 Auth initialization complete');
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    console.log('🔐 Login called with userData:', userData);
    
    // If userData doesn't include all needed fields, fetch them
    if (!userData.id || !userData.fullName) {
      try {
        const userDetails = await fetchUserDetails();
        if (userDetails) {
          userData = userDetails;
        }
      } catch (error) {
        console.error("Could not fetch complete user details after login:", error);
      }
    }
    
    const finalUserData = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      role: userData.role,
      verified: userData.verified
    };
    
    console.log('✅ Setting authenticated user:', finalUserData);
    setUser(finalUserData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('👋 Logout called');
    console.trace('Logout stack trace:');
    setUser(null);
    setIsAuthenticated(false);
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      loading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};