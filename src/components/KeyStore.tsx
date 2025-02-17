import React, { createContext, useContext, useEffect, useState } from 'react';

interface Keys {
  twitchClientId: string;
  twitchClientSecret: string;
  streamlabsToken: string;
  kickApiKey: string;
}

const KeyContext = createContext<Keys | null>(null);

export const useKeys = () => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error('useKeys must be used within a KeyProvider');
  }
  return context;
};

export const KeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keys, setKeys] = useState<Keys | null>(null);

  useEffect(() => {
    setKeys({
      twitchClientId: import.meta.env.VITE_TWITCH_CLIENT_ID,
      twitchClientSecret: import.meta.env.VITE_TWITCH_CLIENT_SECRET,
      streamlabsToken: import.meta.env.VITE_STREAMLABS_TOKEN,
      kickApiKey: import.meta.env.VITE_KICK_API_KEY,
    });
  }, []);

  if (!keys) return null;

  return <KeyContext.Provider value={keys}>{children}</KeyContext.Provider>;
};
