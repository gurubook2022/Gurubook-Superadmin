import { cn } from "../../../../../lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Icon = ({ children, className, ...props }: IconProps) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export default Icon;
