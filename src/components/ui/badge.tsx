import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & { tone?: "default" | "accent" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "accent" && "bg-primary text-primary-foreground",
        tone === "default" && "bg-surface-3 text-foreground",
        tone === "muted" && "bg-surface-2 text-muted",
        className,
      )}
      {...props}
    />
  );
}
