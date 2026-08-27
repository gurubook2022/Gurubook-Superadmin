import { LucideIcon } from "lucide-react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  value: number;
  delta?: string;
  deltaClassName?: string;
}

const StatCard = ({
  icon: Icon,
  iconClassName,
  title,
  value,
  delta,
  deltaClassName = "text-green-dark",
}: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
            iconClassName
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <Text className="font-medium text-gray-600">{title}</Text>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {delta && (
          <Text className={cn("text-sm mt-1", deltaClassName)}>{delta}</Text>
        )}
      </div>
    </div>
  );
};

export default StatCard;
