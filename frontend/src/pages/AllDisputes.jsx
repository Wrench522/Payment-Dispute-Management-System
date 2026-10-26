
import { useMemo, useState } from "react";
import { useDisputes } from "../context/DisputeContext";

export default function AllDisputes() {
  const {
    disputes,
    loading,
    error,
    success,
    setError,
    setSuccess,
    resolveDispute,
    loadDisputes,
  } = useDisputes();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch = [
        dispute.id,
        dispute.transactionReference,
        dispute.customerName,
        dispute.reason,
        dispute.status,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        String(dispute.status).toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchTerm, statusFilter]);

  function exportToCSV() {
    if (filteredDisputes.length === 0) {
      setError("There are no disputes to export.");
      return;
    }

    setError("");
    const columns = [
      "ID",
      "Transaction Reference",
      "Customer Name",
      "Amount",
      "Reason",
      "Status",
    ];

    const rows = filteredDisputes.map((dispute) => [
      dispute.id,
      dispute.transactionReference,
      dispute.customerName,
      dispute.amount,
      dispute.reason,
      dispute.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      columns.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-disputes.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleResolve(dispute) {
    const confirmed = window.confirm(
      `Resolve dispute #${dispute.id}?`
    );

    if (!confirmed) return;

    setResolvingId(dispute.id);
    await resolveDispute(dispute);
    setResolvingId(null);
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>All disputes</h1>
          <p>Search, review, and manage payment disputes.</p>
        </div>

        <button
          className="secondary-button"
          onClick={loadDisputes}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
          <button onClick={setError.bind(null, "")}>×</button>
        </div>
      )}

      {success && (
        <div className="alert success-alert">
          {success}
          <button onClick={setSuccess.bind(null, "")}>×</button>
        </div>
      )}

      <div className="table-toolbar">
        <input
          type="search"
          placeholder="Search by customer, reference, reason..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <button className="primary-button" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>

      <div className="table-card">
        {loading && disputes.length === 0 ? (
          <p className="empty-state">Loading disputes...</p>
        ) : filteredDisputes.length === 0 ? (
          <p className="empty-state">
            No disputes match your search or status filter.
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transaction reference</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id}>
                    <td>#{dispute.id}</td>
                    <td>{dispute.transactionReference || "—"}</td>
                    <td>{dispute.customerName || "—"}</td>
                    <td>
                      {Number(dispute.amount || 0).toLocaleString(
                        "en-KE",
                        {
                          style: "currency",
                          currency: "KES",
                        }
                      )}
                    </td>
                    <td>{dispute.reason || "—"}</td>
                    <td>
                      <span
                        className={`status-badge ${String(
                          dispute.status
                        )
                          .toLowerCase()
                          .replaceAll("_", "-")}`}
                      >
                        {String(dispute.status || "UNKNOWN").replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="small-button"
                          onClick={() => setSelectedDispute(dispute)}
                        >
                          View
                        </button>

                        {String(dispute.status).toUpperCase() !==
                          "RESOLVED" && (
                          <button
                            className="small-button resolve-button"
                            disabled={resolvingId === dispute.id}
                            onClick={() => handleResolve(dispute)}
                          >
                            {resolvingId === dispute.id
                              ? "Resolving..."
                              : "Resolve"}
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

        <div className="table-footer">
          Showing {filteredDisputes.length} of {disputes.length} disputes
        </div>
      </div>

      {selectedDispute && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedDispute(null)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispute-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">DISPUTE DETAILS</p>
                <h2 id="dispute-modal-title">
                  Dispute #{selectedDispute.id}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedDispute(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <dl className="details-list">
              <dt>Transaction reference</dt>
              <dd>{selectedDispute.transactionReference || "—"}</dd>

              <dt>Customer</dt>
              <dd>{selectedDispute.customerName || "—"}</dd>

              <dt>Amount</dt>
              <dd>
                KES {Number(selectedDispute.amount || 0).toLocaleString()}
              </dd>

              <dt>Reason</dt>
              <dd>{selectedDispute.reason || "—"}</dd>

              <dt>Description</dt>
              <dd>{selectedDispute.description || "No description provided."}</dd>

              <dt>Status</dt>
              <dd>{selectedDispute.status || "Unknown"}</dd>
            </dl>

            <button
              className="primary-button"
              onClick={() => setSelectedDispute(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
