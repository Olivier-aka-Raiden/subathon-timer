import { io, Socket } from 'socket.io-client';
import { IDonation, IStreamLabsSocketProps } from '../../types/Sockets';

interface SubEvent {
    type: 'subscription' | 'resub' | 'subMysteryGift';
    message: [{
        sub_type: string;
        name?: string;
        display_name?: string;
        message?: string;
        months?: number;
        streak_months?: number;
        sub_plan: string;
        sub_plan_name?: string;
        subscriber_twitch_id?: number;
        gifter?: string;
        gifter_display_name?: string;
        gifter_twitch_id?: number;
        amount?: number;  // For mystery gifts
    }];
    for: string;
    event_id: string;
}

export const parseStreamLabsEvent = (eventData: any): IDonation | null => {
    // Handle mystery gift subs
    if (eventData.type === 'subMysteryGift') {
        const subEvent = eventData as SubEvent;
        const subData = subEvent.message[0];

        // Return null for invalid sub_plan
        if (!['1000', '2000', '3000'].includes(subData.sub_plan)) {
            console.warn('Invalid sub plan:', subData.sub_plan);
            return null;
        }

        return {
            id: eventData.event_id,
            amount: subData.amount || 1, // Number of mystery gifts
            currency: 'SUB',
            username: subData.gifter || 'Anonymous',
            message: `Mystery gifted ${subData.amount} subs!`,
            date: new Date(),
            platform: 'SL',
            donationType: 'mysteryGift',
            subTier: subData.sub_plan as '1000' | '2000' | '3000'
        };
    }
    if (eventData.type === 'subscription' || eventData.type === 'resub') {
        const subEvent = eventData as SubEvent;
        const subData = subEvent.message[0];

        // Return null for invalid sub_plan
        if (!['1000', '2000', '3000'].includes(subData.sub_plan)) {
            console.warn('Invalid sub plan:', subData.sub_plan);
            return null;
        }

        return {
            id: eventData.event_id,
            amount: 1,
            currency: 'SUB',
            username: subData.gifter ? `${subData.gifter} → ${subData.name}` : subData.name,
            message: subData.message,
            date: new Date(),
            platform: 'SL',
            donationType: 'subscription',
            subTier: subData.sub_plan as '1000' | '2000' | '3000'
        };
    }

    // Handle donation events
    if (eventData.type === 'donation') {
        return {
            id: eventData.event_id,
            amount: parseFloat(eventData.message[0].amount),
            currency: eventData.message[0]?.formatted_amount?.charAt(0),
            username: eventData.message[0].from,
            message: eventData.message[0].message,
            date: new Date(),
            platform: 'SL',
            donationType: 'donation'
        };
    }

    // Handle superchat events
    if (eventData.type === 'superchat') {
        return {
            id: eventData.event_id,
            amount: parseFloat(eventData.message[0].amount),
            currency: eventData.message[0].currency,
            username: eventData.message[0].from,
            message: eventData.message[0].comment,
            date: new Date(),
            platform: 'SL',
            donationType: 'superchat'
        };
    }

    return null;
};

export const connectStreamLabsSocket = ({ authKey }: IStreamLabsSocketProps): Socket | undefined => {
    console.log('connectStreamLabsSocket', authKey);

    if (authKey) {
        console.log('connecting');
        let newSocket = io('https://sockets.streamlabs.com?token=' + authKey, { transports: ['websocket'] });
        newSocket.on('connect', () => {
            console.log('Connected to StreamLabs');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from StreamLabs');
        });

        newSocket.on('event', () => {
            console.log('Received event.');
        });

        return newSocket;
    }

    return;
};
