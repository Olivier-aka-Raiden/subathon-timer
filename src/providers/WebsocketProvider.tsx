import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { StreamLabsWebSocketCtx } from '../context/websockets';
import { AuthenticationCtx } from '../context/authentication';
import { IDonation } from '../types/Sockets';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { connectStreamLabsSocket, parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { useTwitchChat } from '../hooks/useTwitchChat';
import { useTimerStore } from '../stores/useTimerStore';

function WebsocketProvider({ children }: { children: React.ReactNode }) {
    const [donations, setDonations] = useState<IDonation[]>([]);
    const [streamLabsSocket, setStreamLabsSocket] = useState<Socket | null>(null);
    const { streamLabsAuthKey, setStreamLabsAuthKey } = useContext(AuthenticationCtx);
    const { subathonTimerMultiplierData } = useSubathonTimerConfig();
    const [socketStatuses, setSocketStatuses] = useState<{
        streamLabs: string;
        twitch: string;
    }>({
        streamLabs: 'disconnected',
        twitch: 'disconnected'
    });

    const { readyState: twitchReadyState } = useTwitchChat();
    const addTime = useTimerStore(state => state.addTime);

    // Update Twitch connection status
    useEffect(() => {
        setSocketStatuses(prev => ({
            ...prev,
            twitch: twitchReadyState === 1 ? 'connected' : 'disconnected'
        }));
    }, [twitchReadyState]);

    // StreamLabs setup
    useEffect(() => {
        const slKey = import.meta.env.VITE_STREAMLABS_TOKEN;
        if (slKey) {
            setStreamLabsAuthKey(slKey);
        }

        if (streamLabsAuthKey) {
            var wsSL = connectStreamLabsSocket({
                authKey: streamLabsAuthKey,
            });
        }

        if (wsSL) {
            wsSL.on('event', (data: any) => {
                console.log(data);
                let donation = parseStreamLabsEvent(data);
                if (!donation) return;
                if (donation.amount <= 0) return;
                if (donation.donationType === 'subscription' || donation.donationType === 'mysteryGift') {
                    const numberOfSubs = donation.amount || 1;

                    // Add time for each sub
                    addTime({
                        type: 'sub',
                        amount: numberOfSubs,
                        tier: donation.subTier
                    });

                    console.log(`Added time for ${numberOfSubs} ${donation.subTier} subs from ${donation.username}`);
                } else if (donation.donationType === 'donation' && donation.amount > 0) {
                    // Handle regular donation
                    donation.minutesAdded =
                        (donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount;

                    addTime({
                        type: 'donation',
                        amount: donation.amount
                    });
                }

                setDonations((donations) => donations.filter((d) => d.id !== donation.id));
                if (donation) {
                    setDonations((donations) => [...donations, donation]);
                }
            });

            wsSL.on('connect', () => {
                setSocketStatuses((statuses) => ({ ...statuses, streamLabs: 'connected' }));
            });
            wsSL.on('disconnect', () => {
                setSocketStatuses((statuses) => ({ ...statuses, streamLabs: 'disconnected' }));
            });
            setStreamLabsSocket(wsSL);
        }

        return () => {
            if (wsSL) wsSL.close();
        };
    }, [streamLabsAuthKey, donations, subathonTimerMultiplierData]);

    return (
        <StreamLabsWebSocketCtx.Provider value={{
            streamLabsSocket,
            donations,
            socketStatuses
        }}>
            {children}
        </StreamLabsWebSocketCtx.Provider>
    );
}

export default WebsocketProvider;