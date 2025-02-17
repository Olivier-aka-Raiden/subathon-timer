import { useTimerStore } from '../../stores/useTimerStore';

export const TWITCH_WS_URL = 'wss://irc-ws.chat.twitch.tv:443';

export const parseCommand = (data: string, channel: string, sendChatMessage: (message: string) => void) => {
    const commandMatch = data.match(/:(\w+)!.* PRIVMSG #\w+ :!(\w+)(?: ?(-?\d+)?)?/);
    if (!commandMatch) return;

    const [_, userName, command, value] = commandMatch;
    const { addTime, removeTime, togglePause } = useTimerStore.getState();
    const isModerator = data.includes('mod=1') || userName.toLowerCase() === channel.toLowerCase();

    if (!isModerator) return;

    switch (command.toLowerCase()) {
        case 'timerpause':
            togglePause();
            sendChatMessage(`Timer has been ${useTimerStore.getState().isPaused ? 'paused' : 'resumed'} by ${userName}`);
            break;

        case 'timeradd':
            if (value) {
                const minutes = parseInt(value);
                if (!isNaN(minutes) && minutes > 0) {
                    addTime({ type: 'manual', amount: minutes });
                    sendChatMessage(`${userName} added ${minutes} minutes to the timer`);
                }
            }
            break;

        case 'timerremove':
            if (value) {
                const minutes = parseInt(value);
                if (!isNaN(minutes) && minutes > 0) {
                    removeTime(minutes);
                    sendChatMessage(`${userName} removed ${minutes} minutes from the timer`);
                }
            }
            break;
    }
};

export const authenticateAndJoin = (
    sendMessage: (message: string) => void,
    username: string,
    token: string,
    channel: string
) => {
    sendMessage(`PASS oauth:${token}`);
    sendMessage(`NICK ${username}`);
    sendMessage(`JOIN #${channel}`);
    sendMessage('CAP REQ :twitch.tv/commands twitch.tv/tags');
};