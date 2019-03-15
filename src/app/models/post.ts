import { Comentario } from './comentario';
import { Curtida } from './curtidas';

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
    situacao: string;
    publicadoEm: Date;
    localizacao: string;
    totalComentarios: number;
    totalCurtidas: number;
}
