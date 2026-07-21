import { ReactNode } from "react";

interface InputFieldProps {
  label: string;
  defaultValue?: string;
  suffix?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export default function InputField({
  label,
  defaultValue,
  suffix,
  icon,
  disabled,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div
        className={`flex items-center border border-gray-200 rounded-xl overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-500 transition-all ${disabled ? "opacity-60 bg-gray-100" : ""}`}
      >
        <input
          type="text"
          defaultValue={defaultValue}
          disabled={disabled}
          className="w-full bg-transparent p-3 text-xs font-bold outline-none text-gray-800"
        />
        {suffix && (
          <span className="pr-3 text-xs text-gray-400 font-bold">{suffix}</span>
        )}
        {icon && <span className="pr-3 text-gray-400">{icon}</span>}
      </div>
    </div>
  );
}
