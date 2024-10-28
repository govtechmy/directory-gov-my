"use server";

import { getElasticClient } from "./elastic-client";

export interface Aggregations {
  org_agg: string[];
  division_agg: string[];
  subdivision_agg: string[];
}
interface Bucket {
  key: string;
  doc_count: number;
}

export async function getFilterOptions(
  orgFilter?: string,
  divisionFilter?: string,
): Promise<Aggregations> {
  const index = "directory";
  try {
    const result = await getElasticClient().search({
      index,
      aggs: {
        org_agg: {
          terms: {
            field: "org_name.keyword",
          },
        },
        ...(orgFilter
          ? {
              filter_org: {
                filter: {
                  term: {
                    "org_name.keyword": orgFilter,
                  },
                },
                aggs: {
                  division_agg: {
                    terms: {
                      field: "division_name.keyword",
                      size: 1000,
                    },
                  },
                },
              },
            }
          : {}),
        ...(divisionFilter
          ? {
              filter_division: {
                filter: {
                  bool: {
                    must: [
                      {
                        term: {
                          "org_name.keyword": orgFilter,
                        },
                      },
                      {
                        term: {
                          "division_name.keyword": divisionFilter,
                        },
                      },
                    ],
                  },
                },
                aggs: {
                  subdivision_agg: {
                    terms: {
                      field: "unit_name.keyword",
                    },
                  },
                },
              },
            }
          : {}),
      },
    });

    let aggregations: Aggregations = {
      org_agg: [],
      division_agg: [],
      subdivision_agg: [],
    };

    aggregations.org_agg = (result?.aggregations?.org_agg as any)?.buckets.map(
      (bucket: Bucket) => bucket.key,
    );
    aggregations.division_agg = (
      result?.aggregations?.filter_org as any
    )?.division_agg.buckets.map((bucket: Bucket) => bucket.key);
    aggregations.subdivision_agg = (
      result?.aggregations?.filter_division as any
    )?.subdivision_agg.buckets.map((bucket: Bucket) => bucket.key);
    return aggregations;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
