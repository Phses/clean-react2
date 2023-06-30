import React from "react";
import { Login } from "@/presentation/pages";
import { makeRemoteAuthentication } from "../../usecases/authentication/remote-authentication-factory";
import { makeValidation } from "../../validation/validation-factory";

export const MakeLogin: React.FC = () => {
    const validation = makeValidation()
    const authentication = makeRemoteAuthentication()
    return (
        <Login validation={validation} authentication={authentication}/>
    )
}