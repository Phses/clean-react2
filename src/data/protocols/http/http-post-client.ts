import { AuthParams } from "domain/usecases/models/models"

export type PostParams = {
    url: string
    body: AuthParams
}

export interface HttpPostClient {
    post(params: PostParams): Promise<void>
}