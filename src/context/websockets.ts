import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { IDonation } from '../types/Sockets';

export interface IStreamLabsSocketCtx {
    streamLabsSocket: Socket | null;
    donations: IDonation[];
    socketStatuses: {
        streamLabs: string;
        twitch: string;
    };
}

export const StreamLabsWebSocketCtx = createContext<IStreamLabsSocketCtx>({
    streamLabsSocket: null,
    donations: [],
    socketStatuses: {
        streamLabs: 'disconnected',
        twitch: 'disconnected'
    },
});