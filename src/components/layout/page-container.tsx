import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-4 sm:space-y-6", className)} {...props}>
      {children}
    </div>
  );
}
