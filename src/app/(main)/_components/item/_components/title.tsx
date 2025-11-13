import { cn } from "../../../../../lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Title = ({ children, className, ...props }: TitleProps) => {
  return (
    <h3
      className={cn(
        "font-semibold min-w-max text-[#0B0A0C]/70 text-base",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export default Title;
