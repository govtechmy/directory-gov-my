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

export async function filterDropdown(
  ministryFilter?: string,
  divisionFilter?: string,
): Promise<{
  aggregations: Aggregations;
}> {
  const index = "directory";
  try {
    const body: any = {
      size: 0,
      aggs: {},
    };
    if (!ministryFilter && !divisionFilter) {
      // Fetch unique ministries only
      body.aggs.ministry_agg = {
        terms: {
          field: "org_name.keyword",
          size: 1000,
        },
      };
    } else if (ministryFilter && !divisionFilter) {
      // Fetch unique divisions for a specific ministry
      body.query = {
        term: { "org_name.keyword": ministryFilter },
      };
      body.aggs.division_agg = {
        terms: {
          field: "division_name.keyword",
          size: 1000,
        },
      };
    } else if (ministryFilter && divisionFilter) {
      // Fetch units for a specific ministry and division
      body.query = {
        bool: {
          must: [
            { term: { "org_name.keyword": ministryFilter } },
            { term: { "division_name.keyword": divisionFilter } },
          ],
        },
      };
      body.aggs.unit_agg = {
        terms: {
          field: "unit_name.keyword",
          size: 1000,
        },
      };
    }

    const result = await getElasticClient().search({
      index,
      body,
    });

    let aggregations: Aggregations = {
      ministry_agg: [],
      division_agg: [],
      unit_agg: [],
    };

    aggregations.ministry_agg = (
      result?.aggregations?.ministry_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key);
    aggregations.division_agg = (
      result?.aggregations?.division_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key);
    aggregations.unit_agg = (
      result?.aggregations?.unit_agg as any
    )?.buckets.map((bucket: Bucket) => bucket.key);
    return { aggregations };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
