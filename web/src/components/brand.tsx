import { Layers3 } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Layers3 size={21} strokeWidth={1.7} />
      </span>
      {!compact && (
        <span className="brand-name">
          chatgpt<span>2api</span>
          <small>CREATIVE WORKSPACE</small>
        </span>
      )}
    </span>
  );
}
