import { getAvatar } from "@/lib/avatars";

export function AsciiAvatar({ id }: { id: number }) {
  return (
    <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
      <span className="text-xs text-muted select-none">{getAvatar(id)}</span>
    </div>
  );
}
