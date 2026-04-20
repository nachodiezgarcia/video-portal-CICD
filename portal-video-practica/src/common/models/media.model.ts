export interface Media {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Cursos {
  id: string;
  nombre: string;
  imagen: Media;
  descripcion: string;
  lecciones: Lecciones[];
}

export interface Lecciones {
  nombre: string;
  video: Media;
  tiempo: string;
  descripcion: string;
}