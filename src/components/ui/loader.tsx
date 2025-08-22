
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const loaderVariants = cva("inline-flex animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  asChild?: boolean;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div ref={ref} role="status" {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(loaderVariants({ size, className }))}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Loader.displayName = "Loader";

export { Loader, loaderVariants };

    