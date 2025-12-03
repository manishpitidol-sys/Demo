# AuthApp

A React Native authentication app built with TypeScript. Clean UI, proper form validation, and persistent sessions using AsyncStorage.

## Quick Start

Make sure you have Node.js 18+ installed, then:

```bash
# Install dependencies
yarn install

# iOS only - install pods
cd ios && pod install && cd ..
```

Run on Android or iOS:

```bash
yarn android
# or
yarn ios
```

## Project Structure

```
src/
  ├── api/              # API layer (auth endpoints)
  ├── components/       # Reusable UI components
  ├── context/          # React Context (auth state)
  ├── hooks/            # Custom React hooks
  ├── navigation/       # Navigation config
  ├── screens/          # Screen components
  ├── theme/            # Colors, typography, spacing
  ├── types/            # TypeScript definitions
  └── utils/            # Helper functions
```

## Features

- **Authentication**: Sign up, sign in, and sign out flows
- **Form Validation**: Email format, password strength, real-time error messages
- **Persistent Sessions**: Stays logged in after app restarts
- **Accessibility**: Proper labels and roles for screen readers
- **Smooth Animations**: Subtle micro-interactions throughout

## Testing the App

You can either:

1. Create a new account using the sign up screen
2. Use the demo account:
   - Email: `test@test.com`
   - Password: `123456`

All users are stored locally using AsyncStorage (this is a demo app, not connected to a real backend).

## Tech Stack

- React Native 0.73
- TypeScript
- React Navigation (Stack)
- AsyncStorage for persistence
- Vector Icons

## Troubleshooting

**Metro bundler issues:**
```bash
yarn start --reset-cache
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

**iOS pod issues:**
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## Notes

The authentication is handled client-side only. In a production app, you'd replace the `authApi` functions with actual API calls to your backend.
