"use server";

import { getElasticClient } from "./elastic-client";

export interface Aggregations {
  org_agg: string[];
  division_agg: string[];
  subdivision_agg: string[];
}
export interface officeAggregations {
  name_agg: string[];
  state_agg: string[];
}
interface Bucket {
  key: string;
  doc_count: number;
}

export async function getFilterOptions(
  orgFilter?: string,
  divisionFilter?: string,
): Promise<Aggregations> {
  const index = "kakitangan";
  try {
    const result = await getElasticClient().search({
      index,
      aggs: {
        org_agg: {
          terms: {
            field: "org_name.keyword",
            size: 100000,
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
                      size: 100000,
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
                      field: "subdivision_name.keyword",
                      size: 100000,
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

export async function getOfficeFilterOptions(
  nameFilter?: string,
): Promise<officeAggregations> {
  const index = "ministries";
  try {
    const result = await getElasticClient().search({
      index,
      size: 0,
      aggs: {
        name_agg: {
          terms: {
            field: "name.keyword",
            size: 10000,
          },
        },
        ...(nameFilter
          ? {
              filter_name: {
                filter: {
                  term: {
                    "name.keyword": nameFilter,
                  },
                },
                aggs: {
                  state_agg: {
                    terms: {
                      field: "address.state",
                      size: 1000,
                    },
                  },
                },
              },
            }
          : {
              state_agg: {
                terms: {
                  field: "address.state",
                  size: 1000,
                },
              },
            }),
      },
    });

    const officeAgregations: officeAggregations = {
      name_agg: [],
      state_agg: [],
    };

    officeAgregations.name_agg = (
      result?.aggregations?.name_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key);

    if (nameFilter) {
      officeAgregations.state_agg = (
        result?.aggregations?.filter_name as any
      )?.state_agg.buckets.map((bucket: Bucket) => bucket.key);
    } else {
      officeAgregations.state_agg = (
        result?.aggregations?.state_agg as any
      )?.buckets.map((bucket: Bucket) => bucket.key);
    }

    return officeAgregations;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
