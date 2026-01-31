import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  brutalist?: boolean;
}

export function LoadingSpinner({
  className,
  size = "md",
  text = "LOADING...",
  brutalist = true,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
    xl: "size-16",
  };

  if (brutalist) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8",
          className,
        )}
        {...props}>
        <div className='relative'>
          <div className={cn("animate-spin text-charcoal", sizeClasses[size])}>
            <Loader2 className='w-full h-full' />
          </div>
          {/* Decorative brutalist elements */}
          <div className='absolute -top-2 -right-2 size-2 bg-brand border border-charcoal' />
          <div className='absolute -bottom-2 -left-2 size-2 bg-cream border border-charcoal' />
        </div>
        {text && (
          <p className='font-black text-charcoal uppercase tracking-[0.2em] text-xs animate-pulse'>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      {...props}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  );
}
