// @ts-nocheck
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";
const supa = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function main() {
  const [temp, sea, ice, carbon] = await Promise.all([
    meanTemp(),
    meanSea(),
    iceExtent(),
    carbonConc(),
  ]);

  const res = await Promise.all([
    supa.from("mean_temp").insert(temp),
    supa.from("mean_sea").insert(sea),
    supa.from("ice_extent").insert(ice),
    supa.from("carbon_conc").insert(carbon),
  ]);
  console.log(res);
}

main();

async function meanTemp() {
  const tempRes = await fetch("https://global-warming.org/api/temperature-api");
  const tempData = (await tempRes.json()).result
    .map((t: any) => [Math.floor(Number(t.time)), Number(t.station)])
    .filter((t: any) => t[0] >= 1980);

  return averagingByYear(tempData);
}

async function meanSea() {
  return averagingByYear(
    JSON.parse(await fs.readFile("documents/mean-sea.json", "utf-8")) as [
      number,
      number
    ][]
  );
}

async function iceExtent() {
  const iceRes = await fetch("https://global-warming.org/api/arctic-api");
  const iceData = Object.entries((await iceRes.json()).arcticData.data)
    .map((t) => [Number(String(Number(t[0])).slice(0, 4)), Number(t[1].value)])
    .filter((t) => t[1] > 0 && t[0] >= 1980) as [number, number][];

  return averagingByYear(iceData);
}

async function carbonConc() {
  const carbonRes = await fetch(
    "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_3_2_Climate_Indicators_Monthly_Atmospheric_Carbon_Dioxide_concentrations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson"
  );
  const carbonData = (await carbonRes.json()).features
    .map((f: any) => [
      Number(f.properties.Date.slice(0, 4)),
      Number(f.properties.Value),
    ])
    .filter((f: any) => f[0] >= 1980 && f[1] > 0);

  return averagingByYear(carbonData);
}

function averagingByYear(
  data: [number, number][]
): { value: number; year: number }[] {
  const z = new Map();
  data.forEach((d) => {
    z.set(d[0], z.has(d[0]) ? [...z.get(d[0]), d[1]] : [d[1]]);
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
