"use client";
import { type CarbonTempSeaIce } from "@/supabase/queries";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Underline } from "../ui/underline";

const chartConfig = {
  carbon: {
    label: "Global CO2 Concentration",
    color: "hsl(var(--chart-1))",
  },
  sea: {
    label: "Global Mean Sea level",
    color: "hsl(var(--chart-2))",
  },
  temp: {
    label: "Global Mean temperature",
    color: "hsl(var(--chart-3))",
  },
  ice: {
    label: "Global Sea Ice Extent",
    color: "#3182bd",
  },
} as Record<string, any>;
// Mkm²

export function CarbonTempSeaIce({ data }: { data: CarbonTempSeaIce }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setHovering] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      }
    );

    if (chartContainerRef.current) {
      observer.observe(chartContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={chartContainerRef} className="">
      <ChartContainer config={chartConfig} className="max-h-[400px] mx-auto">
        <ComposedChart
          className="relative"
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            // right: 32,
            bottom: 20,
          }}
          onMouseMove={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={50}
            tick={{
              fill: "#000",
              fontFamily: "var(--font-secondary)",
              fontSize: 14,
            }}
          />
          <YAxis
            axisLine={true}
            tickMargin={15}
            type="number"
            domain={[0, 10]}
            ticks={[2, 4, 6, 8, 10]}
            tick={{
              fill: "#000",
              fontFamily: "var(--font-secondary)",
              fontSize: 14,
            }}
          >
            <Label
              angle={-90}
              value={"DANGER"}
              dx={-20}
              className=" fill-red-500 text-lg"
            />
          </YAxis>

          {isVisible && (
            <Tooltip
              contentStyle={{
                border: "solid 0.5px #706b5740",
                fontFamily: "var(--font-secondary)",
              }}
              position={isHovering ? undefined : { x: 100, y: 50 }}
              labelStyle={{
                fontSize: "16px",
                paddingBottom: "8px",
              }}
              itemStyle={{
                fontSize: "14px",
                paddingBottom: "5px ",
              }}
              defaultIndex={4}
              active={true}
              wrapperClassName=" rounded-lg shadow-sm"
              formatter={(value, name) => [
                Number(value).toFixed(1),
                chartConfig[name].label,
              ]}
            />
          )}
          <Area
            dataKey="ice"
            type="monotone"
            // stroke="var(--color-ice)"
            fill="#E0F7FA"
            strokeWidth={0}
            dot={false}
            isAnimationActive={isVisible}
            animationBegin={1200}
          />
          <Line
            connectNulls
            dataKey="carbon"
            type="monotone"
            stroke="var(--color-carbon)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={isVisible}
            animationBegin={300}
          />
          <Line
            connectNulls
            dataKey="temp"
            type="monotone"
            stroke="var(--color-temp)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={isVisible}
            animationBegin={600}
          />
          <Line
            connectNulls
            dataKey="sea"
            type="monotone"
            stroke="var(--color-sea)"
            strokeWidth={2}
            dot={false}
            animationBegin={1000}
            isAnimationActive={isVisible}
          />
        </ComposedChart>
      </ChartContainer>
      <Explanation />
    </div>
  );
}

function Explanation() {
  const info = [
    {
      variable: "Global CO2 Concentration",
      safe: "280 ppm",
      danger: "480 ppm",

      color: "hsl(var(--chart-1))",
    },
    {
      variable: "Global Mean Sea level",
      safe: "0 mm",
      danger: "100 mm",
      color: "hsl(var(--chart-2))",
    },
    {
      variable: "Global Mean Surface Temperature",
      safe: "0 °C",
      danger: "2 °C",
      color: "hsl(var(--chart-3))",
    },
    {
      variable: "Global Sea Ice Extent",
      safe: "23 Mkm²",
      danger: "18 Mkm²",
      color: "#3182bd",
    },
  ];
  return (
    <div className=" max-w-2xl pl-12 mx-auto -translate-y-2">
      <p className=" tracking-tighter xl:text-nowrap text-xs pb-4">
        <strong>Note: </strong>All variables are normalized between{" "}
        <strong>0</strong> and <strong>10</strong>, showing a progression from
        low to high danger.
      </p>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow className=" p-0">
            <TableHead>Parameter</TableHead>
            <TableHead className=" lg:text-center text-green-500 font-medium">
              Danger - 0
            </TableHead>
            <TableHead className=" lg:text-center text-red-500 font-medium">
              Danger - 10
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {info.map((item, idx) => (
            <TableRow key={item.variable}>
              <TableCell style={{ color: item.color }} className=" font-bold">
                {item.variable}
              </TableCell>
              <TableCell className=" lg:text-center">{item.safe}</TableCell>
              <TableCell className=" lg:text-center">{item.danger}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ChartContextInformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    threshold: 0.3,
    once: true,
  });

  return (
    <div
      data-visible={isInView}
      ref={containerRef}
      className="max-w-[480px] text-lg font-medium leading-relaxed pb-8"
    >
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "100ms",
        }}
      >
        The average global temperature has increased
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "200ms",
        }}
      >
        by over <span className="text-red-500">0.08C</span> since the
        pre-industrial era
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "300ms",
        }}
      >
        and is increasing faster since{" "}
        <span className="text-red-500">1970</span> than in
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "400ms",
        }}
      >
        any other 50-year period over at least the
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "500ms",
        }}
      >
        last 2,000 years.{" "}
        <Underline color="black" delay={2000}>
          As the climate heats up,
        </Underline>
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "600ms",
        }}
      >
        <Underline color="black" delay={2000}>
          rainfall patterns change, evaporation
        </Underline>
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "700ms",
        }}
      >
        <Underline color="black" delay={2000}>
          increases, glaciers melt, and sea levels
        </Underline>
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "800ms",
        }}
      >
        <Underline color="black" delay={2000}>
          rise.
        </Underline>{" "}
        Under current warming trends,
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "900ms",
        }}
      >
        <span className="text-red-500">two-thirds</span> of Earth's glaciers may
        vanish by
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "1000ms",
        }}
      >
        2100. Even if the world follows a low
      </p>
      <p
        className={cn("opacity-0", isInView && "animate-fadeIn")}
        style={{
          animationDelay: "1100ms",
        }}
      >
        greenhouse gas pathway, the level of sea rises globally will continue to
        rise up to about <span className="text-red-500">0.7 meters</span> by
        2100.
      </p>
    </div>
  );
}
