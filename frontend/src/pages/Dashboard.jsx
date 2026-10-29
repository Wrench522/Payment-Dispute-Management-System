
import { Link } from "react-router-dom";
import { useDisputes } from "../context/DisputeContext";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { disputes, loading, error, success, loadDisputes } =
    useDisputes();

  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const totalDisputes = disputes.length;

  const openDisputes = disputes.filter(
    (dispute) => dispute.status === "OPEN"
  ).length;

  const resolvedDisputes = disputes.filter(
    (dispute) => dispute.status === "RESOLVED"
  ).length;

  const underReview = disputes.filter(
    (dispute) => dispute.status === "UNDER_REVIEW"
  ).length;

  const recentDisputes = [...disputes]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const formatAmount = (amount) =>
    `KSh ${Number(amount || 0).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className={`dashboard-page ${isAdmin ? "admin-dashboard" : "customer-dashboard"}`}>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            {isAdmin ? "ADMINISTRATION / OVERVIEW" : "YOUR ACCOUNT / OVERVIEW"}
          </p>

          <h1>
            {isAdmin ? "Admin dashboard" : "Welcome back"}
            {!isAdmin && user?.fullName
              ? `, ${user.fullName.split(" ")[0]}`
              : ""}
          </h1>

          <p className="subtitle">
            {isAdmin
              ? "Monitor and manage payment disputes across PayResolve."
              : "Track your payment disputes and stay updated on their progress."}
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

      {!isAdmin && (
        <section className="customer-welcome">
          <div>
            <span className="customer-welcome-icon">✓</span>
            <p className="customer-welcome-label">PAYRESOLVE SUPPORT</p>
            <h2>Your payments. Your peace of mind.</h2>
            <p>
              Have a payment problem? Submit a dispute and follow its
              progress from your personal dashboard.
            </p>
          </div>

          <Link to="/customer/new-dispute" className="customer-primary-button">
            + Submit a dispute
          </Link>
        </section>
      )}

      {loading && disputes.length === 0 ? (
        <p className="empty-state">Loading dashboard...</p>
      ) : (
        <section className="stats">
          <StatCard
            title={isAdmin ? "Total disputes" : "My disputes"}
            value={totalDisputes}
            description={
              isAdmin
                ? "All recorded disputes"
                : "Disputes submitted by you"
            }
          />

          <StatCard
            title={isAdmin ? "Open disputes" : "Awaiting review"}
            value={openDisputes}
            description="Waiting for action"
          />

          <StatCard
            title={isAdmin ? "Under review" : "Being reviewed"}
            value={underReview}
            description="Currently under review"
          />

          <StatCard
            title="Resolved disputes"
            value={resolvedDisputes}
            description="Successfully resolved"
          />
        </section>
      )}

      {isAdmin ? (
        <section className="panel">
          <h2>Administration overview</h2>
          <p>
            Review submitted disputes, monitor their status, and use
            analytics to understand dispute activity.
          </p>
          <div className="customer-quick-links">
            <Link to="/admin/disputes">Manage disputes →</Link>
            <Link to="/admin/analytics">View analytics →</Link>
          </div>
        </section>
      ) : (
        <>
          <section className="panel customer-recent-panel">
            <div className="panel-heading">
              <div>
                <h2>Your recent disputes</h2>
                <p>A quick look at your latest submissions.</p>
              </div>

              <Link to="/customer/disputes" className="customer-text-link">
                View all
              </Link>
            </div>

            {recentDisputes.length === 0 ? (
              <div className="customer-empty">
                <span>📄</span>
                <h3>No disputes yet</h3>
                <p>
                  Your submitted disputes will appear here so you can
                  track their progress.
                </p>
                <Link
                  to="/customer/new-dispute"
                  className="customer-secondary-button"
                >
                  Submit your first dispute
                </Link>
              </div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentDisputes.map((dispute) => (
                      <tr key={dispute.id}>
                        <td className="reference">
                          {dispute.transactionReference || `DIS-${dispute.id}`}
                        </td>
                        <td>{formatAmount(dispute.amount)}</td>
                        <td>
                          {dispute.createdAt
                            ? new Date(dispute.createdAt).toLocaleDateString(
                                "en-KE"
                              )
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${String(
                              dispute.status || ""
                            ).toLowerCase().replaceAll("_", "-")}`}
                          >
                            {String(dispute.status || "UNKNOWN").replaceAll(
                              "_",
                              " "
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="customer-help-panel">
            <div>
              <h3>Need help with a payment?</h3>
              <p>
                Keep your transaction reference and supporting details
                ready when submitting a dispute.
              </p>
            </div>
            <Link to="/customer/new-dispute">Get started →</Link>
          </section>
        </>
      )}
    </div>
  );
}
