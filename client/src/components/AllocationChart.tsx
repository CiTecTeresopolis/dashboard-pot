import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AllocationChartProps {
  data: Record<string, number>;
}

export function AllocationChart({ data }: AllocationChartProps) {
  const chartData = Object.entries(data)
    .map(([secretaria, count]) => ({
      secretaria: secretaria.length > 25 ? secretaria : secretaria,
      fullName: secretaria,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <Card className="bg-emerald-900/45 backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-950/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Alocação por Setor (Top 3)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fill: "white" }} />
            <YAxis
              dataKey="secretaria"
              type="category"
              width={190}
              fontSize={12}
              tick={{ fill: "white" }}
            />
            <Tooltip
              formatter={value => `${value} beneficiários`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
              }}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
