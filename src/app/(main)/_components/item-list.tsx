"use client";
import { cn } from "../../../lib/utils";
import { usePathname } from "next/navigation";
import Item from "./item/index";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ItemListProps {
  level?: number;
  items: {
    id: string;
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
}

const ItemList = ({ level = 0, items }: ItemListProps) => {
  const pathname = usePathname();

  return (
    <>
      <ul className={cn("space-y-2 flex-1", level !== 0 && "mt-4")}>
        <>
          {/* Routes To Be Displayed When Super admin is Signed In */}
          {items?.map((item) => (
            <li key={item.id}>
              <Link href={item?.href}>
                <Item
                  onClick={() => {}}
                  className=""
                  style={{
                    marginLeft: level ? `${level * 12 + 12}px` : "12px",
                  }}
                >
                  <>
                    <div
                      className={cn(
                        "flex items-center group justify-between gap-4 px-4 bg-transparent hover:bg-[#F8F8F8] py-2 transition-all duration-300 w-full rounded-lg",
                        pathname.includes(item.href!) && "bg-[#F8F8F8] py-2"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between gap-4"
                        )}
                      >
                        <Item.Icon>
                          <item.icon
                            className={cn(
                              "w-5 h-5 group-hover:!text-primary group-hover:animate-pulse",
                              pathname.includes(item.href) && "text-primary"
                            )}
                          />
                        </Item.Icon>
                        <Item.Title
                          className={cn(
                            cn(
                              "group-hover:text-[#0B0A0C]",
                              pathname.includes(item.href) && "text-[#0B0A0C]"
                            )
                          )}
                        >
                          {item.title}
                        </Item.Title>
                      </div>
                    </div>
                  </>
                </Item>
              </Link>
            </li>
          ))}
        </>
      </ul>
    </>
  );
};

export default ItemList;
