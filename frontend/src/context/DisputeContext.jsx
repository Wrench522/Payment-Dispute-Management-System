
import { createContext, useContext, useEffect, useState } from "react";

const API_URL =
  "https://payment-dispute-api-docker.onrender.com/api/disputes";

const DisputeContext = createContext(null);

export function DisputeProvider({ children }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadDisputes() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load disputes.");
      }

      const data = await response.json();
      setDisputes(data);
    } catch {
      setError(
        "Unable to load disputes. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  async function submitDispute(form) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) {
        throw new Error(
          "The dispute could not be submitted. Check your entries."
        );
      }

      setSuccess("Dispute submitted successfully!");
      await loadDisputes();
      return true;
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      return false;
    }
  }

  async function resolveDispute(dispute) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${dispute.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "RESOLVED",
        }),
      });

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
    throw new Error("useDisputes must be used inside DisputeProvider.");
  }

  return context;
}
