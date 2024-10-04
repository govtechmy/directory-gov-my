import { Client } from "@elastic/elasticsearch";

const ES_URL = process.env.ES_URL;
const ES_API_KEY = process.env.ES_API_KEY;

if (!ES_URL || !ES_API_KEY) {
  throw new Error(
    "Missing Elasticsearch configuration in environment variables",
  );
}

// Initialize Elasticsearch client
export const client = new Client({
  node: ES_URL,
  auth: {
    apiKey: ES_API_KEY,
  },
});
