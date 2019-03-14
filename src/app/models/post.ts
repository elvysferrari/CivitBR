import { Comentario } from './comentario';

export class Post {
    id: string
    imagens: string[];
    titulo: string;
    descricao: string;
    categoria: string;
    cidade: string;
    inativo: boolean;
    status: string;
    userUid: string;
    userName: string;
    publicadoEm: Date;
    comentarios: Comentario[];
}
