"use server";

import {
  QueryDslQueryContainer,
  SearchTotalHits,
} from "@elastic/elasticsearch/lib/api/types";
import { getElasticClient } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  q?: string,
  org?: string,
  division?: string,
  subdivision?: string,
): Promise<{ kakitangan: any[]; totalPages: number }> {
  const index = "directory";
  const size = 20;
  try {
    const result = await getElasticClient().search({
      index,
      query: {
        bool: {
          must: [
            ...(q
              ? [
                  {
                    multi_match: {
                      query: q,
                      fields: ["*"],
                      type: "bool_prefix",
                    },
                  },
                ]
              : []),
            ...(org ? [{ term: { "org_name.keyword": org } }] : []),
            ...(division
              ? [{ term: { "division_name.keyword": division } }]
              : []),
            ...(subdivision
              ? [{ term: { "unit_name.keyword": subdivision } }]
              : []),
          ] as QueryDslQueryContainer[],
        },
      },
      sort: ["org_sort", "division_sort", "position_sort"],
      size,
      from: (page - 1) * size,
    });
    const total = result.hits.total as SearchTotalHits;
    const kakitangan = result.hits.hits.map((hit) => hit._source);
    return { kakitangan, totalPages: Math.round(total.value / size) };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
