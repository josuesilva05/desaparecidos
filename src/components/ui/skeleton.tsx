import { cn } from "@/lib/utils";

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "shimmer" | "wave";
}) {
  const baseClasses = "rounded-md";

  const variantClasses = {
    default: "bg-gray-200 dark:bg-gray-700 animate-pulse",
    shimmer:
      "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer",
    wave: "bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/10 before:to-transparent",
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Skeleton };
