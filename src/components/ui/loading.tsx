import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

export const Loading = ({
  size = "md",
  message = "Carregando...",
  className = "",
}: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && (
        <span className="text-muted-foreground text-sm">{message}</span>
      )}
    </div>
  );
};

export default Loading;
