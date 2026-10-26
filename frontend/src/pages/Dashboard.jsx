
import { useDisputes } from "../context/DisputeContext";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { disputes, loading, error, success, loadDisputes } = useDisputes();

  const totalDisputes = disputes.length;

  const openDisputes = disputes.filter(
    (dispute) => dispute.status === "OPEN"
  ).length;

  const resolvedDisputes = disputes.filter(
    (dispute) => dispute.status === "RESOLVED"
  ).length;

  const totalAmount = disputes.reduce(
    (total, dispute) => total + Number(dispute.amount || 0),
    0
  );

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">WORKSPACE / OVERVIEW</p>
          <h1>Dispute dashboard</h1>
          <p className="subtitle">
            Manage and track customer payment disputes.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadDisputes}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message" role="status">
          ✓ {success}
        </div>
      )}

      {loading && disputes.length === 0 ? (
        <p className="empty-state">Loading dashboard...</p>
      ) : (
        <section className="stats">
          <StatCard
            title="Total disputes"
            value={totalDisputes}
            description="All recorded disputes"
          />

          <StatCard
            title="Open disputes"
            value={openDisputes}
            description="Awaiting review"
          />

          <StatCard
            title="Resolved disputes"
            value={resolvedDisputes}
            description="Successfully resolved"
          />

          <StatCard
            title="Total disputed amount"
            value={`KSh ${totalAmount.toLocaleString("en-KE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            description="Across all disputes"
          />
        </section>
      )}

      <section className="panel">
        <h2>Welcome to PayResolve</h2>
        <p>
          Use the menu on the left to view analytics, manage disputes,
          or submit a new dispute.
        </p>
      </section>
    </>
  );
}
