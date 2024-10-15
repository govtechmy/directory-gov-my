"use server";

import { getElasticClient } from "./elastic-client";

export interface Aggregations {
  ministry_agg: string[];
  division_agg: string[];
  unit_agg: string[];
}
interface Bucket {
  key: string;
  doc_count: number;
}

export async function filterDropdown(): Promise<{
  aggregations: Aggregations;
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
              size: 1000,
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

    let aggregations: Aggregations = {
      ministry_agg: [],
      division_agg: [],
      unit_agg: [],
    };

    aggregations.ministry_agg = (
      result?.aggregations?.ministry_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key.toUpperCase());
    aggregations.division_agg = (
      result?.aggregations?.division_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key.toUpperCase());
    aggregations.unit_agg = (
      result?.aggregations?.unit_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key.toUpperCase());
    return { aggregations };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
