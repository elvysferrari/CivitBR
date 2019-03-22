import { Comentario } from './comentario';
import { Curtida } from './curtidas';

export class Post {
    id: string
    imagens: string[];
    titulo: string;
    descricao: string;
    departamento: string;
    cidade: string;
    inativo: boolean;
    status: string;
    userUid: string;
    userName: string;
    situacao: string;
    publicadoEm: any;
    localizacao: string;
    totalComentarios: number;
    totalCurtidas: number;
}
