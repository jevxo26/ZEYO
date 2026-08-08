interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
}


export function SectionHeader({ title, actionLabel, onActionClick }: SectionHeaderProps) {
  return (
    <div className="mb-2 flex items-center justify-between px-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {actionLabel && (
        <button onClick={onActionClick} className="text-xs font-medium text-teal-700">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
