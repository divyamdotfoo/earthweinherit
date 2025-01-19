import { createClient } from "@supabase/supabase-js";
const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function main() {
  // meanTemp();
  // carbonConc();
  // iceExtent();
  // meanSea();
  await supa
    .from("page")
    .update({
      source_img: "https://www.google.com/s2/favicons?sz=64&domain=ipbes.net",
    })
    .eq("source", "IPBES 11");
}

main();

async function meanTemp() {
  const tempRes = await fetch("https://global-warming.org/api/temperature-api");
  const tempData = (await tempRes.json()).result
    .map((t: any) => [Math.floor(Number(t.time)), Number(t.station)])
    .filter((t: any) => t[0] >= 1980);
  const withNormalizedData = normalizeClimateData({
    data: averagingByYear(tempData),
    dangerThreshold: 2,
    safeThreshold: 0,
  });

  await supa.from("mean_temp").upsert(withNormalizedData);
}

async function carbonConc() {
  const carbonRes = await fetch(
    "https://ourworldindata.org/grapher/co2-long-term-concentration.csv?v=1&csvType=filtered&useColumnShortNames=true&time=1980..latest"
  );
  const carbonData = (await carbonRes.text())
    .split("\n")
    .slice(1)
    .map((d) => ({
      year: Number(d.split(",")[2]),
      value: Number(d.split(",")[3]),
    }));

  const withNormalization = normalizeClimateData({
    data: carbonData,
    dangerThreshold: 480,
    safeThreshold: 280,
  });
  await supa.from("carbon_conc").upsert(withNormalization);
}

async function meanSea() {
  const seaRes = await fetch(
    "https://ourworldindata.org/grapher/sea-level.csv?v=1&csvType=filtered&useColumnShortNames=true&time=1980-01-15..2020-10-15&facet=none"
  );
  const seaData = (await seaRes.text())
    .split("\n")
    .slice(1)
    .map((z) => [
      Number(z.split(",").at(2)?.slice(0, 4)),
      Number(z.split(",").at(-2)),
    ]) as [number, number][];

  const withNormalization = normalizeClimateData({
    data: averagingByYear(seaData),
    dangerThreshold: 100,
    safeThreshold: 0,
  });

  await supa.from("mean_sea").upsert(withNormalization);
}

async function iceExtent() {
  const iceRes = await fetch(
    "https://www.ncei.noaa.gov/access/monitoring/snow-and-ice-extent/sea-ice/G/4/data.json"
  );

  const iceData = Object.entries(
    (await iceRes.json()).data as Record<string, { value: number }>
  ).map(([year, data]) => ({
    year: Number(year),
    value: Number(data.value),
  }));

  const withNormalization = normalizeClimateData({
    data: iceData,
    dangerThreshold: 18,
    safeThreshold: 23,
    isDecreasing: true,
  });

  await supa.from("ice_extent").upsert(withNormalization);
}

function averagingByYear(
  data: [number, number][]
): { value: number; year: number }[] {
  const z = new Map();
  data.forEach(([year, value]) => {
    z.set(year, z.has(year) ? [...z.get(year), value] : [value]);
  });

  return Array.from(z.entries()).map((t) => ({
    year: Number(t[0]),
    value: Number(
      (
        t[1].reduce((prev: number, curr: number) => prev + curr, 0) /
        t[1].length
      ).toFixed(3)
    ),
  }));
}

function normalizeClimateData({
  data,
  dangerThreshold,
  safeThreshold,
  scale = 10,
  isDecreasing = false,
}: {
  data: Array<{ year: number; value: number }>;
  dangerThreshold: number;
  safeThreshold: number;
  scale?: number;
  isDecreasing?: boolean;
}) {
  return data.map((d) => {
    const normalizedValue = isDecreasing
      ? scale * ((safeThreshold - d.value) / (safeThreshold - dangerThreshold))
      : scale * ((d.value - safeThreshold) / (dangerThreshold - safeThreshold));

    return {
      ...d,
      normalized: Number(
        Math.max(0, Math.min(scale, normalizedValue)).toFixed(2)
      ),
    };
  });
}
