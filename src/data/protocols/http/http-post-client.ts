import { AuthParams } from "@/domain/usecases/models/models"
import { HttpResponse } from "@/data/protocols/http/http-response"

export type PostParams = {
    url: string
    body: AuthParams
}

export interface HttpPostClient {
    post(params: PostParams): Promise<HttpResponse>
}