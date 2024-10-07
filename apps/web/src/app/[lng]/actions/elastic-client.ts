import { Client } from "@elastic/elasticsearch";

const ES_URL = process.env.ES_URL;
const ES_API_KEY = process.env.ES_API_KEY;
let client: Client | null = null;

export function getElasticClient(): Client {
  if (!client) {
    client = new Client({
      node: ES_URL,
      auth: {
        apiKey: ES_API_KEY,
      },
    });
  }
  return client;
}
