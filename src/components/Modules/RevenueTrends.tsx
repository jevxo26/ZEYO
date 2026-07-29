export default function RevenueTrends() {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Revenue Trends</h3>
          <p className="text-[11px] text-gray-400">Monthly growth vs commission</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold px-3 py-1.5 text-gray-600 focus:outline-none">
          <option>This Year</option>
        </select>
      </div>
      
      <div className="h-44 flex flex-col justify-between text-[10px] font-bold text-gray-400 relative">
        {["1M", "750k", "500k", "250k", "0"].map((level, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-8 text-right">{level}</span>
            <div className="flex-1 border-b border-gray-100" />
          </div>
        ))}
        <div className="flex justify-between pl-12 pt-2 text-gray-500 font-medium">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}