"use client";
import { type CarbonTempSeaIce } from "@/supabase/queries";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export function CarbonTempSeaIce({ data }: { data: CarbonTempSeaIce }) {
  console.log(data);
  return (
    <div
      suppressHydrationWarning
      className=" grid grid-cols-2 gap-3 justify-items-center"
    >
      <ChartContainer
        config={{
          value: { label: "temperature" },
        }}
      >
        <LineChart
          width={400}
          height={300}
          data={data.temp}
          className=" bg-secondary w-full h-auto rounded-md"
          margin={{ top: 30, bottom: 10, right: 30 }}
        >
          <CartesianGrid />
          <XAxis dataKey="year" />
          <YAxis dataKey="value" />
          <Line type="monotone" dataKey="value" color="#8884d8" />
          <Tooltip />
          <Legend />
        </LineChart>
      </ChartContainer>
      {/* 
      <LineChart
        width={400}
        height={300}
        data={data.carbon}
        className=" bg-secondary w-full h-auto rounded-md"
        margin={{ top: 30, bottom: 10, right: 30 }}
      >
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis
          dataKey="value"
          domain={([min, max]) => [100, Math.floor(max + 50)]}
          allowDecimals={false}
        />

        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        <Tooltip />
        <Legend />
      </LineChart>
      <LineChart
        width={400}
        height={300}
        data={data.ice}
        className=" bg-secondary w-full h-auto rounded-md"
        margin={{ top: 30, bottom: 10, right: 30 }}
      >
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis dataKey="value" allowDecimals={false} domain={[16, 25]} />

        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        <Tooltip />
        <Legend />
      </LineChart>
      <LineChart
        width={400}
        height={300}
        data={data.sea}
        className=" bg-secondary w-full h-auto rounded-md"
        margin={{ top: 30, bottom: 10, right: 30 }}
      >
        <CartesianGrid />
        <XAxis dataKey="year" />
        <YAxis dataKey="value" allowDecimals={false} />

        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        <Tooltip />
        <Legend />
      </LineChart> */}
    </div>
  );
}
