import { AuthParams } from "@/domain/models/auth-models"
import { HttpResponse } from "@/data/protocols/http/http-response"

export type PostParams<T> = {
    url: string
    body?: T
}

export interface HttpPostClient<T, R> {
    post(params: PostParams<T>): Promise<HttpResponse<R>>
}