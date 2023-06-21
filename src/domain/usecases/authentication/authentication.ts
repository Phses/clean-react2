import { AuthParams, AuthToken } from "@/domain/usecases/models/models";


export interface authentication {
    auth(params: AuthParams): Promise<AuthToken>; 
}