"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface SalesChartProps {
  data: { name: string; total: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">Tidak ada data penjualan</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `Rp ${new Intl.NumberFormat("id-ID").format(value)}`
          }
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat("id-ID").format(value),
            "Total",
          ]}
          cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
        />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" name="Penjualan" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
