import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-emerald-900/45 backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-950/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-white" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-xs text-white/80 mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={`text-xs mt-2 font-semibold ${
              trend.direction === "up"
                ? "text-green-400"
                : trend.direction === "down"
                  ? "text-red-400"
                  : "text-gray-300"
            }`}
          >
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
