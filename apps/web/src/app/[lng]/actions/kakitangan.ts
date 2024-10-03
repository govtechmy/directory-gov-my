"use server";

import { SearchTotalHits } from "@elastic/elasticsearch/lib/api/types";
import { client } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  q?: string,
): Promise<{ directory: any[]; totalPages: number }> {
  const index = "test-directory";
  const size = 20;
  try {
    const result = await client.search({
      index,
      q,
      sort: ["org_sort", "division_sort", "person_sort"],
      query: {
        match_all: {},
      },
      size,
      from: page * size,
    });
    const total = result.hits.total as SearchTotalHits;
    const directory = result.hits.hits.map((hit) => hit._source);
    console.log(`Fetched ${directory.length} documents from ${index}`);
    return { directory, totalPages: Math.round(total.value / size) };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
