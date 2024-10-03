"use server";
import { Client } from "@elastic/elasticsearch";

// Elasticsearch configuration
const ES_URL = process.env.ES_URL;
const API_ID_ES = process.env.API_ID_ES;
const API_KEY_ES = process.env.API_KEY_ES;

if (!ES_URL || !API_ID_ES || !API_KEY_ES) {
  throw new Error(
    "Missing Elasticsearch configuration in environment variables",
  );
}

// Initialize Elasticsearch client
const client = new Client({
  node: ES_URL,
  auth: {
    apiKey: {
      id: API_ID_ES,
      api_key: API_KEY_ES,
    },
  },
});

// Fetch all data from test-directory index
export async function fetchAllData(): Promise<any[]> {
  try {
    const result = await client.search({
      index: "test-directory",
      body: {
        query: {
          match_all: {},
        },
        size: 10000, // Adjust this value, now limit to 3
      },
    });

    const allData = result.hits.hits.map((hit) => hit._source);
    console.log(`Fetched ${allData.length} documents from test-directory`);
    return allData;
  } catch (error) {
    console.error("Error fetching data from test-directory:", error);
    throw error;
  }
}
