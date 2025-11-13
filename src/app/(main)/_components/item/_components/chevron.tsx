import { cn } from "../../../../../lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface ChevronProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Chevron = ({ children, className, ...props }: ChevronProps) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export default Chevron;
