import { client } from "../../common/api/client";
import type { Cursos } from "../../common/models/media.model";

export const getCourse = async (id: string): Promise<Cursos> =>
  await client.getContent<Cursos>({ id, includeRelatedContent: true });
