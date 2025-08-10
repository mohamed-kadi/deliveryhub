import axios from "axios";


import googleAuthService from "./googleAuthService";

const API_BASE = "http://localhost:8080/api/auth";

// Store tokens
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token"); // Remove old token if exists
};


// Regular email/password login
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE}/login`, { email, password });
  
  // Handle BOTH old and new response formats
  const responseData = response.data;
  
  if (responseData.accessToken && responseData.refreshToken) {
    // NEW format with refresh tokens
    const { accessToken, refreshToken, email: userEmail, role } = responseData;
    setTokens(accessToken, refreshToken);
    
    return {
      token: accessToken,
      user: {
        email: userEmail,
        role,
      },
    };
  } else {
    // OLD format (fallback)
    const { token, email: userEmail, fullName, role } = responseData;
    localStorage.setItem("token", token); // Keep old storage for now
    
    return {
      token,
      user: {
        email: userEmail,
        fullName,
        role,
      },
    };
  }
};

// Logout function
export const logoutUser = async () => {
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      await axios.post(`${API_BASE}/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }
  clearTokens();
};



export const authenticateWithGoogle = async (googleCredential, role = 'CUSTOMER') => {
    console.log('🔍 AUTHSERVICE: Received role parameter:', role); // Debug
  console.log('🔍 AUTHSERVICE: Sending to backend:', { 
    credential: googleCredential, 
    role: role 
  });
  try {
    // Send Google credential to unified backend endpoint
    const response = await axios.post(`${API_BASE}/google-auth`, {
      credential: googleCredential,
      role: role
    });
    
    const responseData = response.data;
    
    if (responseData.accessToken && responseData.refreshToken) {
      // NEW format with refresh tokens
      const { accessToken, refreshToken, email, role: userRole } = responseData;
      setTokens(accessToken, refreshToken);
      
      return {
        token: accessToken,
        user: {
          email,
          role: userRole,
        },
      };
    } else {
      // OLD format (fallback)
      const { token, email, role: userRole } = responseData;
      localStorage.setItem("token", token);
      
      return {
        token,
        user: {
          email,
          role: userRole,
        },
      };
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    console.error('❌ Full axios error:', error);
    console.error('❌ Error response data:', error.response?.data);
    console.error('❌ Error response status:', error.response?.status);
    console.error('❌ Error message:', error.message);

        // Also check if it's a network error
    if (!error.response) {
      console.error('❌ Network error - no response from server');
    }
    throw new Error('Google authentication failed. Please try again.');
  }
};

//========> start of paste
// Refresh token function (only works with new format)
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_BASE}/refresh`, {
      refreshToken: refreshToken
    });

    const { accessToken, refreshToken: returnedRefreshToken } = response.data;
    
    // Only update refresh token if a new one was provided
    if (returnedRefreshToken && returnedRefreshToken !== refreshToken) {
      setTokens(accessToken, returnedRefreshToken);
    } else {
      // Just update the access token
      localStorage.setItem("accessToken", accessToken);
    }
    
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};
//<======== end of paste

// // Refresh token function (only works with new format)
// export const refreshAccessToken = async () => {
//   const refreshToken = getRefreshToken();
//   if (!refreshToken) {
//     throw new Error("No refresh token available");
//   }

//   const response = await axios.post(`${API_BASE}/refresh`, {
//     refreshToken: refreshToken
//   });

//   const { accessToken, refreshToken: newRefreshToken } = response.data;
//   setTokens(accessToken, newRefreshToken);
  
//   return accessToken;
// };



export const registerUser = async (userData) => {
  const response = await fetch("http://localhost:8080/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
};

