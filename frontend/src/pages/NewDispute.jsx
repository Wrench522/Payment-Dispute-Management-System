
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisputes } from "../context/DisputeContext";

const initialForm = {
  transactionReference: "",
  customerName: "",
  amount: "",
  reason: "",
  description: "",
};

export default function NewDispute() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const { submitDispute, error, success, setError, setSuccess } =
    useDisputes();

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const submitted = await submitDispute(form);

      if (submitted) {
        setForm(initialForm);
        navigate("/disputes");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>New dispute</h1>
          <p>Register a payment dispute for investigation.</p>
        </div>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert success-alert">
          {success}
          <button type="button" onClick={() => setSuccess("")}>
            ×
          </button>
        </div>
      )}

      <div className="form-card">
        <h2>Dispute information</h2>
        <p className="form-description">
          Enter the transaction details and explain why it is being disputed.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="transactionReference">
                Transaction reference *
              </label>
              <input
                id="transactionReference"
                name="transactionReference"
                value={form.transactionReference}
                onChange={handleChange}
                placeholder="e.g. TXN-2026-001"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="customerName">Customer name *</label>
              <input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="amount">Amount (KES) *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 2500"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="reason">Dispute reason *</label>
              <select
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
              >
                <option value="">Select a reason</option>
                <option value="UNAUTHORIZED_TRANSACTION">
                  Unauthorized transaction
                </option>
                <option value="DUPLICATE_TRANSACTION">
                  Duplicate transaction
                </option>
                <option value="INCORRECT_AMOUNT">Incorrect amount</option>
                <option value="GOODS_NOT_RECEIVED">
                  Goods or services not received
                </option>
                <option value="REFUND_NOT_RECEIVED">
                  Refund not received
                </option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-field full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the problem with this transaction..."
                rows="5"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/disputes")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit dispute"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
