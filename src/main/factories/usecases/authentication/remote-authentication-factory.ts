import { RemoteAuthentication } from "@/data/usecases/authentication";
import { makeHttpClient } from "../../http/http-client-factory";
import { Authentication } from "@/domain/usecases/authentication";

export const makeRemoteAuthentication = (): Authentication => {
    const url = 'http://localhost:5050/api/login'
    return new RemoteAuthentication(url, makeHttpClient())
}