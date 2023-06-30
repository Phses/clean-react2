import { HttpPostClient, HttpResponse, PostParams } from "@/data/protocols/http";
import axios, { AxiosResponse } from "axios"

export class AxiosHttpClient implements HttpPostClient<any, any> {
    async post(params: PostParams<any>): Promise<HttpResponse<any>> {
        let result: AxiosResponse
        try {
            result = await axios.post(params.url, params.body)
        }catch(Error) {
            result = Error.response
        }
        return {
            StatusCode: result.status,
            Body: result.data
        }
    }
}