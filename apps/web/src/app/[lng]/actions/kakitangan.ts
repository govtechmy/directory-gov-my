"use server";

import { client } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  q?: string,
): Promise<any[]> {
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
    const allData = result.hits.hits.map((hit) => hit._source);
    console.log(`Fetched ${allData.length} documents from ${index}`);
    return allData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
