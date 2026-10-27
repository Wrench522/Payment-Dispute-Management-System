
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getSavedSession() {
  try {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (!token || !savedUser) return null;

    return {
      token,
      user: JSON.parse(savedUser),
    };
  } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession);

  async function register(fullName, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        (response.status === 409
          ? "An account with this email already exists."
          : "Unable to create your account.")
      );
    }

    return data;
  }

  async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        "Unable to sign in. Check your credentials."
      );
    }

    if (!data.token) {
      throw new Error(
        "The server did not return an authentication token."
      );
    }

    const user = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(user));

    setSession({
      token: data.token,
      user,
    });

    return user;
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
