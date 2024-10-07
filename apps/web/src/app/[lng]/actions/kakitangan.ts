"use server";

import { SearchTotalHits } from "@elastic/elasticsearch/lib/api/types";
import { getElasticClient } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  q?: string,
): Promise<{ kakitangan: any[]; totalPages: number }> {
  const index = "test-directory";
  const size = 20;
  try {
    const result = await getElasticClient().search({
      index,
      q,
      sort: ["org_sort", "division_sort", "person_sort"],
      query: {
        match_all: {},
      },
      size,
      from: (page - 1) * size,
    });
    const total = result.hits.total as SearchTotalHits;
    const kakitangan = result.hits.hits.map((hit) => hit._source);
    console.log(`Fetched ${kakitangan.length} documents from ${index}`);
    return { kakitangan, totalPages: Math.round(total.value / size) };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
