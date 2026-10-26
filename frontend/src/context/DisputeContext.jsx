
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
}/disputes`;

const DisputeContext = createContext(null);

export function DisputeProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function apiRequest(url, options = {}) {
    if (!token) {
      throw new Error("Please sign in to continue.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    return response;
  }

  async function loadDisputes() {
    if (!isAuthenticated || !token) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(API_URL);

      if (!response.ok) {
        throw new Error("Could not load disputes.");
      }

      setDisputes(await response.json());
    } catch (err) {
      setError(err.message || "Unable to load disputes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      loadDisputes();
    } else {
      setDisputes([]);
      setLoading(false);
      setError("");
      setSuccess("");
    }
  }, [isAuthenticated, token]);

  async function submitDispute(form) {
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest(API_URL, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("The dispute could not be submitted.");
      }

      setSuccess("Dispute submitted successfully!");
      await loadDisputes();
      return true;
    } catch (err) {
      setError(err.message || "Unable to submit dispute.");
      return false;
    }
  }

  async function resolveDispute(dispute) {
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest(
        `${API_URL}/${dispute.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "RESOLVED" }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not resolve this dispute.");
      }

      setSuccess("Dispute resolved successfully!");
      await loadDisputes();
      return true;
    } catch (err) {
      setError(err.message || "Unable to resolve dispute.");
      return false;
    }
  }

  return (
    <DisputeContext.Provider
      value={{
        disputes,
        loading,
        error,
        success,
        setError,
        setSuccess,
        loadDisputes,
        submitDispute,
        resolveDispute,
      }}
    >
      {children}
    </DisputeContext.Provider>
  );
}

export function useDisputes() {
  const context = useContext(DisputeContext);

  if (!context) {
    throw new Error(
      "useDisputes must be used inside DisputeProvider."
    );
  }

  return context;
}
