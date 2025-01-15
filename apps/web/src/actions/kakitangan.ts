"use server";

import { estypes } from "@elastic/elasticsearch";
import { getElasticClient } from "./elastic-client";

export async function searchKakitangan(
  page: number,
  size: number,
  q?: string,
  org?: string,
  division?: string,
  subdivision?: string,
): Promise<{ kakitangan: any[]; totalPages: number }> {
  const index = "kakitangan";
  let queries = [] as estypes.QueryDslQueryContainer[];

  if (q) {
    const trimmed_q = q.trim();
    const index = trimmed_q.lastIndexOf(" ");
    const match_bool = { match: { query: trimmed_q.substring(0, index) } };
    const prefix = { prefix: { prefix: trimmed_q.substring(index + 1) } };
    const match_bool_prefix = {
      all_of: {
        intervals: index > 0 ? [match_bool, prefix] : prefix,
      },
    } as estypes.QueryDslIntervalsQuery;
    queries = [
      { intervals: { person_name: match_bool_prefix } },
      { intervals: { position_name: match_bool_prefix } },
      {
        multi_match: {
          query: q,
          fields: ["org_name", "division_name", "subdivision_name"],
          type: "phrase_prefix",
        },
      },
      { term: { person_email: q } },
      { term: { person_fax: q } },
      { term: { person_phone: q } },
    ];
  }

  let must = [] as estypes.QueryDslQueryContainer[];
  if (queries.length > 0) {
    must = must.concat({ dis_max: { queries } });
  }
  if (org) {
    must = must.concat({ term: { "org_name.keyword": org } });
  }
  if (division) {
    must = must.concat({ term: { "division_name.keyword": division } });
  }
  if (subdivision) {
    must = must.concat({ term: { "subdivision_name.keyword": subdivision } });
  }

  const query = must.length > 0 ? { bool: { must } } : undefined;

  try {
    const result = await getElasticClient().search({
      index,
      query,
      sort: ["org_sort", "division_sort", "position_sort"],
      size,
      from: (page - 1) * size,
    });
    const total = result.hits.total as estypes.SearchTotalHits;
    const totalPages = Math.ceil(total.value / size);
    const kakitangan = result.hits.hits.map((hit) => hit._source);
    return { kakitangan, totalPages };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function searchOffice(
  page: number,
  size: number,
  searchText?: string,
  name?: string,
  state?: string,
): Promise<{ office: any[]; totalPages: number }> {
  const index = "pejabat";

  try {
    const result = await getElasticClient().search({
      index,
      query: {
        bool: {
          must: [
            ...(searchText
              ? [
                  {
                    multi_match: {
                      query: searchText,
                      fields: ["*"],
                      type: "bool_prefix",
                    },
                  },
                ]
              : []),
            ...(name ? [{ term: { "name.keyword": name } }] : []),
            ...(state ? [{ term: { "address.state": state } }] : []),
          ] as estypes.QueryDslQueryContainer[],
        },
      },
      sort: ["name.keyword"],
      size,
      from: (page - 1) * size,
    });

    const total = result.hits.total as estypes.SearchTotalHits;
    const office = result.hits.hits.map((hit) => hit._source);
    return {
      office,
      totalPages: Math.ceil(total.value / size),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
