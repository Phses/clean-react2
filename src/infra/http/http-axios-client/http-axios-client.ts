import { HttpPostClient, HttpResponse, PostParams } from "@/data/protocols/http";
import axios from "axios"

export class AxiosHttpClient implements HttpPostClient<any, any> {
    async post(params: PostParams<any>): Promise<HttpResponse<any>> {
        const result = await axios.post(params.url, params.body)
        return {
            StatusCode: result.status,
            Body: result.data
        }
    }
}