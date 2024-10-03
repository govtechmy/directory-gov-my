import { Client } from "@elastic/elasticsearch";

const ES_URL = process.env.ES_URL;
const API_ID_ES = process.env.API_ID_ES;
const API_KEY_ES = process.env.API_KEY_ES;

if (!ES_URL || !API_ID_ES || !API_KEY_ES) {
  throw new Error(
    "Missing Elasticsearch configuration in environment variables",
  );
}

// Initialize Elasticsearch client
export const client = new Client({
  node: ES_URL,
  auth: {
    apiKey: {
      id: API_ID_ES,
      api_key: API_KEY_ES,
    },
  },
});
