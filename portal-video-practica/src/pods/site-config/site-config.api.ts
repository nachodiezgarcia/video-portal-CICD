import { queryOptions } from "@tanstack/react-query";
import { client } from "../../common/api/client";
import type { SiteConfig } from "../../common/models/site-config.model";

const getSiteConfig = async (): Promise<SiteConfig> =>
  await client.getContent<SiteConfig>({ contentType: "SiteConfig" });

export const siteConfigQueryOptions = () =>
  queryOptions({
    queryKey: ["siteConfig"],
    queryFn: getSiteConfig,
  });
