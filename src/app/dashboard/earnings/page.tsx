import {
  SlidersHorizontal,
  MoreVertical,
  DollarSign,
  Calendar,
  Percent,
  ArrowUpRight,
  Download,
} from "lucide-react";

export default function EarningsPage() {
  const transactions = [
    { id: "#BKG-2941", name: "Rahman Wedding Reception", date: "Oct 24, 2023", amount: "$4,500.00", tag: "Paid", positive: true },
    { id: "#BKG-2942", name: "TechCorp Annual Gala", date: "Oct 28, 2023", amount: "$12,000.00", tag: "Pending", positive: null },
    { id: "#BKG-2938", name: "Ahmed Anniversary Dinner", date: "Oct 12, 2023", amount: "$1,250.00", tag: "Paid", positive: true },
    { id: "#BKG-2935", name: "Startup Launch Party", date: "Oct 05, 2023", amount: "$3,800.00", tag: "Paid", positive: true },
    { id: "#BKG-2930", name: "Fashion Week Afterparty", date: "Sep 28, 2023", amount: "$8,500.00", tag: "Disputed", positive: false },
  ];

  const tagStyle = (tag: string) => {
    if (tag === "Paid") return { bg: "rgba(16,185,129,0.1)", color: "#059669" };
    if (tag === "Pending") return { bg: "rgba(245,158,11,0.1)", color: "#d97706" };
    return { bg: "rgba(239,68,68,0.1)", color: "#dc2626" };
  };

  const bars = [
    { m: "May", pct: 35, val: "$4.2k" },
    { m: "Jun", pct: 60, val: "$7.5k" },
    { m: "Jul", pct: 30, val: "$3.8k" },
    { m: "Aug", pct: 88, val: "$11.2k" },
    { m: "Sep", pct: 50, val: "$6.4k" },
    { m: "Oct", pct: 100, val: "$12.8k", active: true },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", transform: "translate(40%, -40%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Financial Overview</h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">Track your earnings, payouts, and transaction history.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-purple-700 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
          >
            <Download size={13} /> Withdraw Funds
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "Total Revenue", val: "$124,500", sub: "Year to date", badge: "+12.5%", badgePos: true,
            icon: DollarSign, gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)", glow: "rgba(124,58,237,0.25)"
          },
          {
            label: "Upcoming Payouts", val: "$8,250", sub: "Scheduled Oct 15", badge: "3 pending", badgePos: null,
            icon: Calendar, gradient: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(245,158,11,0.2)"
          },
          {
            label: "Commission Paid", val: "$12,450", sub: "10% platform fee", badge: "Paid", badgePos: true,
            icon: Percent, gradient: "linear-gradient(135deg, #2563eb, #0ea5e9)", glow: "rgba(37,99,235,0.25)"
          },
        ].map((c, i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{c.label}</span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: c.badgePos === true ? "rgba(16,185,129,0.1)" : c.badgePos === false ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                  color: c.badgePos === true ? "#059669" : c.badgePos === false ? "#dc2626" : "#d97706",
                }}
              >
                ↗ {c.badge}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: c.gradient, boxShadow: `0 4px 12px ${c.glow}` }}
              >
                <c.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.03em" }}>{c.val}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{c.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Monthly Earnings Trend</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Track your business growth across the year.</p>
          </div>
          <select
            className="text-[10px] font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", color: "#7c3aed" }}
          >
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>

        <div className="h-52 flex items-end justify-between gap-2 px-2 border-b pb-0" style={{ borderColor: "rgba(124,58,237,0.08)" }}>
          {bars.map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: bar.active ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#374151" }}
              >
                {bar.val}
              </span>
              <div
                className="w-full rounded-t-xl transition-all duration-300"
                style={{
                  height: `${bar.pct * 1.6}px`,
                  background: bar.active
                    ? "linear-gradient(180deg, #7c3aed, #2563eb)"
                    : "rgba(124,58,237,0.12)",
                  boxShadow: bar.active ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
                }}
              />
              <span className="text-[10px] font-bold text-gray-400">{bar.m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
        }}
      >
        <div className="p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-3" style={{ borderColor: "rgba(124,58,237,0.08)" }}>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Transactions</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search transaction..."
              className="rounded-xl pl-3 pr-3 py-2 text-xs outline-none w-48 font-medium text-gray-700"
              style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.12)" }}
            />
            <button
              className="p-2 rounded-xl cursor-pointer"
              style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.12)", color: "#7c3aed" }}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(124,58,237,0.04)", borderBottom: "1px solid rgba(124,58,237,0.08)", color: "#6b7280" }}
            >
              <tr>
                <th className="p-4 pl-6">Booking ID</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-gray-700" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
              {transactions.map((t, idx) => {
                const style = tagStyle(t.tag);
                return (
                  <tr key={idx} className="transition-colors" style={{ cursor: "pointer" }}>
                    <td className="p-4 pl-6 font-bold" style={{ color: "#7c3aed" }}>{t.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{t.name}</td>
                    <td className="p-4 text-gray-400 font-medium">{t.date}</td>
                    <td className="p-4 font-black text-gray-900">{t.amount}</td>
                    <td className="p-4">
                      <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {t.tag}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-1 rounded-lg transition-colors cursor-pointer" style={{ color: "#9ca3af" }}>
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
