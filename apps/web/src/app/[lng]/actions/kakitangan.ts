"use server";

import {
  QueryDslQueryContainer,
  SearchTotalHits,
} from "@elastic/elasticsearch/lib/api/types";
import { getElasticClient } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  q?: string,
  org_name?: string,
  unit_name?: string,
  division_name?: string,
): Promise<{ kakitangan: any[]; totalPages: number }> {
  const index = "directory";
  const size = 20;
  try {
    const result = await getElasticClient().search({
      index,
      body: {
        query: {
          bool: {
            must: [
              ...(q
                ? [
                    {
                      multi_match: {
                        query: q,
                        fields: ["*"],
                        type: "phrase_prefix",
                      },
                    },
                  ]
                : []),
              ...(org_name ? [{ term: { "org_name.keyword": org_name } }] : []),
              ...(unit_name
                ? [{ term: { "unit_name.keyword": unit_name } }]
                : []),
              ...(division_name
                ? [{ term: { "division_name.keyword": division_name } }]
                : []),
            ] as QueryDslQueryContainer[],
          },
        },
        sort: ["org_sort", "division_sort", "position_sort"],
        size,
        from: (page - 1) * size,
      },
    });
    const total = result.hits.total as SearchTotalHits;
    const kakitangan = result.hits.hits.map((hit) => hit._source);
    return { kakitangan, totalPages: Math.round(total.value / size) };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
