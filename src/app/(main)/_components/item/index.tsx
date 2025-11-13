import { FC, HTMLAttributes, ReactNode } from "react";
import Icon from "./_components/icon";
import Title from "./_components/title";
import Chevron from "./_components/chevron";
import { cn } from "../../../../lib/utils";

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Item = ({ children, className, ...props }: ItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between md:cursor-pointer gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Item.Icon = Icon;
Item.Title = Title;
Item.Chevron = Chevron;

export default Item;
