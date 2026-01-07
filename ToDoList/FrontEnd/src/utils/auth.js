export const getTokenData = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    // Simple JWT decode without library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserRole = () => {
  const tokenData = getTokenData();
  // Check for role in token claims (could be 'role' or 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role')
  return tokenData?.role || tokenData?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

export const isAdmin = () => {
  const role = getUserRole();
  return role === 'Admin' || (Array.isArray(role) && role.includes('Admin'));
};
