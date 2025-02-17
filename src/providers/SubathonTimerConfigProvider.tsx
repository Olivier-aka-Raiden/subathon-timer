import { useState } from 'react';
import { SubathonTimerConfigCtx } from '../context/subathon-time';

export const SubathonTimerConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [subathonTimerStyle, setSubathonTimerStyle] = useState({});
    const [subathonTimerMultiplierData, setSubathonTimerMultiplierData] = useState({
        minutes: 7,
        amount: 5
    });

    return (
        <SubathonTimerConfigCtx.Provider
            value={{
                subathonTimerStyle,
                setSubathonTimerStyle,
                subathonTimerMultiplierData,
                setSubathonTimerMultiplierData
            }}
        >
            {children}
        </SubathonTimerConfigCtx.Provider>
    );
};