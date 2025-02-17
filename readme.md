# Subathon Timer

A customizable timer for Twitch subathons that integrates with StreamLabs alerts and Twitch chat commands. The timer automatically adds time for subscriptions and donations, with support for different subscription tiers and moderator controls via chat commands.

## Features

### Subscription Time Addition
- Tier 1 Sub: +7 minutes
- Tier 2 Sub: +15 minutes
- Tier 3 Sub: +30 minutes
- Supports:
    - Regular subscriptions
    - Gift subscriptions
    - Mystery gift subscriptions (bulk gifts)
    - Resubscriptions

### Donation Time Addition
- Adds 7 minutes for every 5€/$ donated
- Supports:
    - Regular donations
    - SuperChat
    - Stars

### Moderator Chat Commands
- `!timerPause` - Toggles timer pause state
- `!timerAdd [minutes]` - Adds specified minutes to timer
    - Example: `!timerAdd 30` adds 30 minutes
- `!timerRemove [minutes]` - Removes specified minutes from timer
    - Example: `!timerRemove 15` removes 15 minutes

### Visual Features
- Clean, readable display with days, hours, minutes, and seconds
- Visual indication when timer is paused
- Transparent background for easy OBS integration
- Automatic time updates even while paused

## Requirements

- Node.js (v18 or higher)
- NPM (v8 or higher)
- A StreamLabs account
- A Twitch account with moderator privileges

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd subathon-timer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your credentials:
```env
VITE_TWITCH_CHANNEL=your_channel_name
VITE_TWITCH_USERNAME=your_bot_username
VITE_TWITCH_OAUTH_TOKEN=oauth:your_oauth_token
VITE_STREAMLABS_TOKEN=your_streamlabs_token
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables Setup

### Twitch Setup
1. Get your Twitch OAuth token:
    - Visit [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/)
    - Authorize with your bot account
    - Copy the generated token (includes 'oauth:' prefix)

2. Fill in Twitch variables:
    - `VITE_TWITCH_CHANNEL`: Your channel name (lowercase)
    - `VITE_TWITCH_USERNAME`: Your bot's username (lowercase)
    - `VITE_TWITCH_OAUTH_TOKEN`: The OAuth token from step 1

### StreamLabs Setup
1. Get your StreamLabs Socket API Token:
    - Log into [StreamLabs Dashboard](https://streamlabs.com/dashboard)
    - Go to Settings → API Settings
    - Copy your Socket API Token

2. Add to environment:
    - `VITE_STREAMLABS_TOKEN`: Your StreamLabs Socket API Token

## OBS Setup

1. Add a Browser Source in OBS:
    - Right-click in Sources → Add → Browser
    - Set the URL to your local development server (e.g., `http://localhost:5173`)
    - Set width and height as needed (recommended: 800x200)
    - Set background color to transparent

2. Position the timer where desired in your stream layout

## Development

- Build the project:
```bash
npm run build
```

- Preview production build:
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Uses Zustand for state management
- StreamLabs API for donation tracking
- Twitch IRC for chat commands
