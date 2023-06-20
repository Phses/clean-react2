import { AuthParams, AuthToken } from "../models/models";


export interface authentication {
    auth(params: AuthParams): Promise<AuthToken>; 
}