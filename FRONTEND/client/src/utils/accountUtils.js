export const logout = () => {
  localStorage.clear(); // clears all localStorage (including JWT and session data)
  window.location.href = '/login'; // redirect to login
};