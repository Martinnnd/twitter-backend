import { CursorPagination } from "@types";
import { CreateCommentDto } from "../dto";
import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";

export interface CommentRepository {
    create(userId: string, data: CreateCommentDto): Promise<PostDTO>;
    getAllByPostId(postId: string, pagination: CursorPagination): Promise<ExtendedPostDTO[]>;
    delete(commentId: string): Promise<void>;
    getById(commentId: string): Promise<PostDTO | null>;
    getByAuthorId(authorId: string): Promise<PostDTO[]>;
}