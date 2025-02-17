import { useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import { TWITCH_WS_URL, authenticateAndJoin, parseCommand } from '../services/sockets/twitch';

export const useTwitchChat = () => {
    const username = import.meta.env.VITE_TWITCH_USERNAME;
    const token = import.meta.env.VITE_TWITCH_OAUTH_TOKEN;
    const channel = import.meta.env.VITE_TWITCH_CHANNEL;

    const { sendMessage, lastMessage, readyState } = useWebSocket(TWITCH_WS_URL, {
        onOpen: () => {
            console.info('Connected to Twitch IRC');
            authenticateAndJoin(sendMessage, username, token, channel);
        },
        onClose: () => console.info('Disconnected from Twitch IRC'),
        onError: (event) => console.error('WebSocket error:', event),
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    const sendChatMessage = useCallback((message: string) => {
        sendMessage(`PRIVMSG #${channel} :${message}`);
    }, [sendMessage, channel]);

    const handleMessage = useCallback((message: MessageEvent) => {
        const data = message.data;

        // Handle PING messages
        if (data.startsWith('PING :')) {
            const pingMessage = data.substring(6);
            sendMessage(`PONG :${pingMessage}`);
            return;
        }

        // Log connection status messages
        if (data.includes('CAP * ACK')) {
            console.info('Capabilities acknowledged');
        }
        if (data.includes(' 001 ')) {
            console.info('Successfully logged in');
        }
        if (data.includes(`:End of /NAMES list`)) {
            console.info(`Joined channel #${channel}`);
        }

        // Parse commands
        parseCommand(data, channel, sendChatMessage);
    }, [sendMessage, channel, sendChatMessage]);

    useEffect(() => {
        if (lastMessage) {
            handleMessage(lastMessage);
        }
    }, [lastMessage, handleMessage]);

    return {
        sendChatMessage,
        readyState,
    };
};