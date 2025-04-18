// utils/auth.js
export const isTokenExpired = (token) => {
    if (!token) return true;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
      const expiry = payload.exp; // Token expiry time (in seconds)
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
  
      return now >= expiry; // Return true if token is expired
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat invalid tokens as expired
    }
  };