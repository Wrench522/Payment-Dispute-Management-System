
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://payment-dispute-api-docker.onrender.com/api/disputes";

function App() {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState("");

  
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    transactionReference: "",
    customerName: "",
    reason: "",
    amount: "",
  });

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
      setError("Unable to load disputes. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }


  async function handleResolve(dispute) {
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

      if (selectedDispute?.id === dispute.id) {
        setSelectedDispute({
          ...selectedDispute,
          status: "RESOLVED",
        });
      }

      await loadDisputes();
    } catch (err) {
      setError(err.message || "Unable to resolve dispute.");
    }
  }


  async function handleSubmit(event) {
    event.preventDefault();
setError("");
setSuccess("");
setSubmitting(true);

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
        throw new Error("The dispute could not be submitted. Check your entries.");
      }

      setForm({
  transactionReference: "",
  customerName: "",
  reason: "",
  amount: "",
});

setSuccess("Dispute submitted successfully!");
await loadDisputes();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalAmount = disputes.reduce(
    (total, dispute) => total + Number(dispute.amount),
    0
  );
//this
  const filteredDisputes = [...disputes]
  .reverse()
  .filter((dispute) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      (dispute.transactionReference || "").toLowerCase().includes(search) ||
      (dispute.customerName || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" || dispute.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">PD</div>
          <div>
            <h2>PayResolve</h2>
            <span>Dispute Management</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; Dashboard</div>
        <div className="nav-item">▤ &nbsp; All disputes</div>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          Backend API
          <span className="connected">Connected*</span>
          <p className="sidebar-note">
            *Connection is confirmed when data loads successfully.
          </p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h1>Dispute dashboard</h1>
            <p className="subtitle">
              Manage and track customer payment disputes.
            </p>
          </div>
          <button className="refresh-button" onClick={loadDisputes}>
            ↻ Refresh
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}
        {success && (
  <div className="success-message" role="status">
    ✓ {success}
  </div>
)}

        <section className="stats">
          <div className="stat-card">
            <p>Total disputes</p>
            <h2>{disputes.length}</h2>
            <span>All recorded disputes</span>
          </div>

          <div className="stat-card">
            <p>Open disputes</p>
            <h2>
              {disputes.filter((d) => d.status === "OPEN").length}
            </h2>
            <span>Awaiting review</span>
          </div>

          <div className="stat-card">
            <p>Total disputed amount</p>
            <h2>
              KSh{" "}
              {totalAmount.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span>Across all disputes</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h2>Submit a dispute</h2>
                <p>Enter the transaction details below.</p>
              </div>
              <span className="heading-icon">＋</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="transactionReference">
                Transaction reference
              </label>
              <input
                id="transactionReference"
                name="transactionReference"
                value={form.transactionReference}
                onChange={handleChange}
                placeholder="e.g. TXN-2026-001"
                required
              />

              <label htmlFor="customerName">Customer name</label>
              <input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />

              <label htmlFor="amount">Disputed amount (KSh)</label>
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

              <label htmlFor="reason">Reason for dispute</label>
              <textarea
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Describe the payment problem..."
                rows="4"
                required
              />

              <button className="submit-button" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit dispute →"}
              </button>
            </form>
          </div>

          <div className="panel table-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent disputes</h2>
                <p>Disputes saved in your database.</p>
              </div>
              <span className="count-badge">{disputes.length} total</span>
            </div>
               
             
             <div className="table-controls">
  <input
    type="search"
    className="search-input"
    placeholder="Search reference or customer..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    aria-label="Search disputes"
  />

  <select
    className="status-filter"
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
    aria-label="Filter disputes by status"
  >
    <option value="ALL">All statuses</option>
    <option value="OPEN">Open</option>
    <option value="RESOLVED">Resolved</option>
  </select>
</div>



            {loading ? (
              <p className="empty-state">Loading disputes...</p>
            ) : filteredDisputes.length === 0 ? (

              
  <p className="empty-state">
    {disputes.length === 0
      ? "No disputes found. Submit one to get started."
      : "No disputes match your search or selected status."}
  </p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>REFERENCE</th>
                      <th>CUSTOMER</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  
  <tbody>
    {filteredDisputes.map((dispute) => (
      <tr key={dispute.id}>
        <td className="reference">
          {dispute.transactionReference}
        </td>

        <td>{dispute.customerName}</td>

        <td>
          KSh{" "}
          {Number(dispute.amount).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>

        <td>
          <span
            className={`status-badge ${(dispute.status || "OPEN").toLowerCase()}`}
          >
            {dispute.status}
          </span>
        </td>

        <td>
          {dispute.createdAt
            ? new Date(dispute.createdAt).toLocaleDateString("en-KE")
            : "—"}
        </td>

        <td>
          <div className="action-buttons">
            <button
              type="button"
              className="view-button"
              onClick={() => setSelectedDispute(dispute)}
            >
              View details
            </button>

            {dispute.status === "OPEN" && (
              <button
                type="button"
                className="resolve-button"
                onClick={() => handleResolve(dispute)}
              >
                Resolve
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>


                </table>
              </div>
            )}
          </div>
        </section>

{selectedDispute && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedDispute(null)}
  >
    <section
      className="details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-heading">
        <div>
          <p className="eyebrow">DISPUTE INFORMATION</p>
          <h2 id="details-title">Dispute details</h2>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={() => setSelectedDispute(null)}
          aria-label="Close dispute details"
        >
          ×
        </button>
      </div>

      <div className="details-list">
        <div className="detail-item">
          <span>Transaction reference</span>
          <strong>{selectedDispute.transactionReference}</strong>
        </div>

        <div className="detail-item">
          <span>Customer name</span>
          <strong>{selectedDispute.customerName}</strong>
        </div>

        <div className="detail-item">
          <span>Disputed amount</span>
          <strong>
            KSh{" "}
            {Number(selectedDispute.amount).toLocaleString("en-KE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className="detail-item">
          <span>Status</span>
          <strong>
            {selectedDispute.status || "UNKNOWN"}
          </strong>
        </div>

        <div className="detail-item">
          <span>Date submitted</span>
          <strong>
            {selectedDispute.createdAt
              ? new Date(selectedDispute.createdAt).toLocaleString("en-KE")
              : "—"}
          </strong>
        </div>

        <div className="detail-item detail-reason">
          <span>Reason for dispute</span>
          <p>{selectedDispute.reason || "No reason provided."}</p>
        </div>
      </div>

      <button
        type="button"
        className="submit-button modal-close"
        onClick={() => setSelectedDispute(null)}
      >
        Close details
      </button>
    </section>
  </div>
)}
        <footer>PayResolve · Payment Dispute Management System</footer>
      </main>
    </div>
  );
}

export default App;
