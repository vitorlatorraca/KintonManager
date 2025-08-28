interface StampProgressProps {
  current: number;
  total: number;
}

export default function StampProgress({ current, total }: StampProgressProps) {
  const stamps = Array.from({ length: total }, (_, i) => i < current);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="kinton-yellow text-2xl font-bold uppercase tracking-wider mb-2">
          {current}/{total} STAMPS
        </h3>
        <div className="kinton-progress h-3 mb-4">
          <div 
            className="kinton-progress-bar h-full"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {stamps.map((filled, index) => (
          <div
            key={index}
            className={`kinton-stamp ${filled ? '' : 'empty'} kinton-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {filled ? '★' : index + 1}
          </div>
        ))}
      </div>
      
      {current === total && (
        <div className="text-center mt-4">
          <span className="kinton-reward-badge kinton-glow">
            FREE GYOZA AVAILABLE!
          </span>
        </div>
      )}
    </div>
  );
}
