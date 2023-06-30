import { HttpPostClient } from "@/data/protocols/http";
import { AxiosHttpClient } from "@/infra/http/http-axios-client/http-axios-client";

export const makeHttpClient = (): AxiosHttpClient => {
    return new AxiosHttpClient()
   
}