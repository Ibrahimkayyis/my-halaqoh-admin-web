import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("p-4 md:p-8 w-full max-w-7xl mx-auto", className)} {...props}>
      {children}
    </div>
  );
}
