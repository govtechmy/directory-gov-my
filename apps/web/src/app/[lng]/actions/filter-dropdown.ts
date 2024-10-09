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
            aggs: {
              org_details: {
                top_hits: {
                  size: 1,
                  _source: ["org_id", "org_name"],
                },
              },
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
    aggregations.division_agg = result?.aggregations?.division_agg?.buckets.map(
      (bucket) => bucket.key,
    );
    aggregations.unit_agg = result?.aggregations?.unit_agg?.buckets.map(
      (bucket) => bucket.key,
    );
    aggregations.ministry_agg = result?.aggregations?.ministry_agg?.buckets.map(
      (bucket) => {
        const orgDetails = bucket.org_details.hits.hits[0]._source;
        return {
          org_id: orgDetails.org_id,
          org_name: orgDetails.org_name,
        };
      },
    );
    return { aggregations };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
