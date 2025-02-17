import { useState, useEffect } from 'react';
import { AuthenticationCtx } from '../context/authentication';

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
    const [streamLabsAuthKey, setStreamLabsAuthKey] = useState('');

    useEffect(() => {
        // Load from environment variables
        const slKey = import.meta.env.VITE_STREAMLABS_TOKEN;
        if (slKey) {
            setStreamLabsAuthKey(slKey);
        }
    }, []);

    return (
        <AuthenticationCtx.Provider value={{ streamLabsAuthKey, setStreamLabsAuthKey }}>
            {children}
        </AuthenticationCtx.Provider>
    );
};