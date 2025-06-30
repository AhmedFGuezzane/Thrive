
import config from "../config";

const BASE_URL = config.authMicroserviceBaseUrl;

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erreur inattendue");
  return json;
};

const getToken = () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("Authentification requise");
  return token;
};

export const login = async (email, mot_de_passe) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, mot_de_passe }),
  });
  return await handleResponse(res);
};

export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
};

export const getMe = async () => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
};

export const resetPassword = async (email, new_password) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, new_password }),
  });
  return await handleResponse(res);
};

export const changePassword = async (current_password, new_password) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_password, new_password }),
  });
  return await handleResponse(res);
};

export const updateProfile = async (profileData) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/update-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return await handleResponse(res);
};

export const deactivateAccount = async () => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/deactivate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleResponse(res);
};

export const deleteAccount = async () => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/auth/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleResponse(res);
};
