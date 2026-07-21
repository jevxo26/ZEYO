interface StatusProps {
  status:
    | "Paid"
    | "Pending"
    | "Disputed"
    | "Confirmed"
    | "Pending Details"
    | "Vendor Assignment in Progress";
}

export default function StatusBadge({ status }: StatusProps) {
  const themes: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Confirmed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    "Pending Details": "bg-amber-50 text-amber-700",
    "Vendor Assignment in Progress": "bg-amber-50 text-amber-700",
    Disputed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${themes[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}
