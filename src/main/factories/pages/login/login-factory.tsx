import { RemoteAuthentication } from "@/data/usecases/authentication";
import { AxiosHttpClient } from "@/infra/http/http-axios-client/http-axios-client";
import { Login } from "@/presentation/pages";
import { ValidationComposite } from "@/presentation/validation";
import { ValidationBuilder } from "@/presentation/validation/validation-builder/validation-builder";
import React from "react";

export const MakeLogin: React.FC = () => {
    const validation = ValidationComposite.build([
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().minLength(5).build()
    ])
    const url = 'http://localhost:5050/api/login'
    const httpClient = new AxiosHttpClient()
    const authentication = new RemoteAuthentication(url, httpClient)
    return (
        <Login validation={validation} authentication={authentication}/>
    )
}