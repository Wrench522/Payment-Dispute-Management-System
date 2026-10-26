
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useDisputes } from "../context/DisputeContext";

const chartColors = ["#f59e0b", "#16a34a", "#3b82f6"];

export default function Analytics() {
  const { disputes, loading, error } = useDisputes();

  const disputeChartData = [
    {
      name: "Open",
      value: disputes.filter((d) => d.status === "OPEN").length,
    },
    {
      name: "Resolved",
      value: disputes.filter((d) => d.status === "RESOLVED").length,
    },
    {
      name: "Under Review",
      value: disputes.filter((d) => d.status === "UNDER_REVIEW").length,
    },
  ];

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">WORKSPACE / REPORTS</p>
          <h1>Analytics</h1>
          <p className="subtitle">
            Understand your payment dispute statistics.
          </p>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="chart-section">
        <h2>Dispute Status Overview</h2>

        {loading && disputes.length === 0 ? (
          <p>Loading analytics...</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disputeChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {disputeChartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </>
  );
}
