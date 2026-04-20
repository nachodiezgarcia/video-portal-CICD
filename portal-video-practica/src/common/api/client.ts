import { createClient } from "@content-island/api-client";

export const client = createClient({
  accessToken: import.meta.env.VITE_CONTENT_ISLAND_TOKEN as string,
});
