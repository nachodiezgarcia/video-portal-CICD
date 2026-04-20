import { client } from "../../common/api/client";
import type { Cursos } from "../../common/models/media.model";

export const getCourses = async (): Promise<Cursos[]> => {
  return await client.getContentList<Cursos>({
    contentType: "Cursos",
  });
};
