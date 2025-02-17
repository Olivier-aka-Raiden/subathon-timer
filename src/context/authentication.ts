import { createContext } from 'react';

export interface IAuthenticationCtx {
    streamLabsAuthKey: string;
    setStreamLabsAuthKey: (key: string) => void;
}

export const AuthenticationCtx = createContext<IAuthenticationCtx>({
    streamLabsAuthKey: '',
    setStreamLabsAuthKey: () => {},
});