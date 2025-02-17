export type DonationPlatform = 'SL';
export type DonationType = 'superchat' | 'donation' | 'stars' | 'subscription' | 'mysteryGift';

export interface IDonation {
    id: string;
    amount: number;
    currency: string;
    username: string | undefined;
    message?: string;
    date: Date;
    platform: DonationPlatform;
    donationType: DonationType;
    displayed?: boolean;
    minutesAdded?: number;
    subTier?: '1000' | '2000' | '3000';
}

export interface IStreamLabsSocketProps {
    authKey: string;
}