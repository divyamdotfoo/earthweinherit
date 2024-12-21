// temp 1979-present
// https://global-warming.org/api/temperature-api

// co2 1958-present
// https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_3_2_Climate_Indicators_Monthly_Atmospheric_Carbon_Dioxide_concentrations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson

// https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_3_3_melted_new/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson

// ice 1979-present
// https://global-warming.org/api/arctic-api

async function graphOneIndicators() {
  const tempRes = await fetch("https://global-warming.org/api/temperature-api");
  const tempData = ((await tempRes.json()) as any).result as any[];
  const temp = new Map();
  tempData
    .map((t) => ({ time: Number(t.time), temp: Number(t.station) }))
    .filter((t) => t.time >= 1980)
    .forEach((t) => {
      temp.set(
        Math.floor(t.time),
        temp.has(Math.floor(t.time))
          ? [...temp.get(Math.floor(t.time)), t.temp]
          : [t.temp]
      );
    });

  // from 1980-present
  const TEMP = Array.from(temp.entries()).map((t) =>
    Number(
      (
        t[1].reduce((prev: number, curr: number) => prev + curr, 0) /
        t[1].length
      ).toFixed(3)
    )
  );

  const iceRes = await fetch("https://global-warming.org/api/arctic-api");
  const iceData = ((await iceRes.json()) as any).arcticData.data as Record<
    string,
    any
  >;

  const ice = new Map();
  Object.entries(iceData)
    .filter((t) => t[1].value > 0)
    .map((t) => ({
      time: Number(String(Number(t[0])).slice(0, 4)),
      ice: Number(t[1].value),
    }))
    .filter((t) => t.time >= 1980)
    .forEach((t) => {
      ice.set(t.time, ice.has(t.time) ? [...ice.get(t.time), t.ice] : [t.ice]);
    });

  const ICE = Array.from(ice.entries()).map((t) =>
    Number(
      (
        t[1].reduce((prev: number, curr: number) => prev + curr, 0) /
        t[1].length
      ).toFixed(3)
    )
  );
  console.log(TEMP, TEMP.length, ICE, ICE.length);
}

graphOneIndicators();
