import { HttpResponse } from "./http-response"

export type GetParams = {
  url: string
}

export interface HttpGetClient<T> {
  get: (params: GetParams) => Promise<HttpResponse<T>>
}