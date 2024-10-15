"use server";

import { getElasticClient } from "./elastic-client";

interface aggregationsInterface {
  ministry_agg: string[];
  division_agg: string[];
  unit_agg: [];
}

export async function filterDropdown(): Promise<{
  aggregations: aggregationsInterface;
}> {
  const index = "directory";
  try {
    const result = await getElasticClient().search({
      index,
      body: {
        size: 0,
        aggs: {
          ministry_agg: {
            terms: {
              field: "org_name.keyword",
              size: 10000,
            },
          },
          division_agg: {
            terms: {
              field: "division_name.keyword",
              size: 1000,
            },
          },
          unit_agg: {
            terms: {
              field: "unit_name.keyword",
              size: 1000,
            },
          },
        },
      },
    });
    let aggregations: aggregationsInterface = {
      ministry_agg: [],
      division_agg: [],
      unit_agg: [],
    };
    aggregations.ministry_agg = result?.aggregations?.ministry_agg?.buckets.map(
      (bucket) => bucket.key,
    );
    aggregations.division_agg = result?.aggregations?.division_agg?.buckets.map(
      (bucket) => bucket.key.toUpperCase(),
    );
    aggregations.unit_agg = result?.aggregations?.unit_agg?.buckets.map(
      (bucket) => bucket.key.toUpperCase(),
    );
    return { aggregations };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
