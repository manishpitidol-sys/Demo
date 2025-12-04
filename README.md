# React Native User Authentication App

A complete React Native authentication application built with TypeScript, React Navigation, Context API, and AsyncStorage. This app demonstrates a clean architecture with reusable components and proper state management.

## 🚀 Features

- ✅ **User Authentication**
  - Login with email and password
  - Signup with name, email, and password
  - Logout functionality

- ✅ **Form Validation**
  - Email format validation
  - Password length validation (minimum 6 characters)
  - Real-time error messages

- ✅ **State Management**
  - Context API for global authentication state
  - AsyncStorage for persistent login
  - Automatic user restoration on app start

- ✅ **UI/UX**
  - Clean and modern design
  - Reusable components (TextInput, Button, ErrorText)
  - Password visibility toggle
  - Loading states
  - Keyboard-aware scrolling

- ✅ **Navigation**
  - Stack Navigator with conditional routing
  - Automatic navigation based on auth state
  - Smooth transitions

## 📁 Project Structure

```
src/
  ├── components/          # Reusable UI components
  │   ├── CustomTextInput.tsx
  │   ├── CustomButton.tsx
  │   └── ErrorText.tsx
  ├── context/            # Context API providers
  │   └── AuthContext.tsx
  ├── navigation/         # Navigation setup
  │   └── AppNavigator.tsx
  ├── screens/            # Screen components
  │   ├── LoginScreen.tsx
  │   ├── SignupScreen.tsx
  │   └── HomeScreen.tsx
  ├── utils/              # Utility functions
  │   ├── validation.ts
  │   └── storage.ts
  └── types/              # TypeScript types
      └── index.ts
App.tsx                   # Root component
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (>= 18)
- Yarn
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

### Installation

1. **If starting from scratch, initialize React Native project:**

   ```bash
   npx react-native@latest init ReactNativeAuthApp --template react-native-template-typescript
   cd ReactNativeAuthApp
   ```

   Then copy all the files from this project into the new project.

   **OR** if you already have a React Native project set up, proceed to step 2.

2. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **iOS Setup (macOS only):**

   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Link native dependencies:**

   For React Native 0.60+, auto-linking should handle this. If you encounter issues:

   ```bash
   # For vector icons (iOS)
   cd ios && pod install && cd ..
   ```

## 🏃 Running the App

### Android

```bash
yarn android
```

### iOS

```bash
yarn ios
```

### Start Metro Bundler

```bash
yarn start
```

## 🔐 Dummy Credentials

The app comes with a pre-configured test user:

**Login Credentials:**
- **Email:** `test@test.com`
- **Password:** `123456`

You can also create a new account using the Signup screen. New users will be automatically logged in after successful signup.

## 📱 How It Works

### Authentication Context

The `AuthContext` manages the global authentication state:

- **State:**
  - `user`: Currently logged-in user object (or null)
  - `isLoading`: Loading state during app initialization

- **Methods:**
  - `login(email, password)`: Authenticates user and stores session
  - `signup(name, email, password)`: Creates new user account
  - `logout()`: Clears user session and navigates to login

### Navigation Flow

1. **App Start:**
   - Checks AsyncStorage for existing user session
   - If user exists → Navigate to HomeScreen
   - If no user → Navigate to LoginScreen

2. **Login Flow:**
   - User enters credentials
   - Validates input
   - Authenticates with dummy database
   - On success → Navigate to HomeScreen

3. **Signup Flow:**
   - User enters name, email, password
   - Validates all fields
   - Creates new account
   - Auto-login → Navigate to HomeScreen

4. **Logout:**
   - Clears user from context
   - Removes from AsyncStorage
   - Navigate to LoginScreen

### Components

#### CustomTextInput
- Reusable text input with label and error handling
- Supports password visibility toggle
- Customizable styling

#### CustomButton
- Primary and secondary variants
- Loading state support
- Disabled state handling

#### ErrorText
- Consistent error message display
- Centered text styling

## 🎨 Styling

The app uses a consistent color scheme:
- Primary: `#007AFF` (iOS blue)
- Error: `#e74c3c` (red)
- Background: `#f5f5f5` (light gray)
- Text: `#333` (dark gray)

## 📦 Dependencies

- `react-native`: Core framework
- `@react-navigation/native`: Navigation library
- `@react-navigation/native-stack`: Stack navigator
- `@react-native-async-storage/async-storage`: Persistent storage
- `react-native-vector-icons`: Icon library
- `react-native-screens`: Native screen components
- `react-native-safe-area-context`: Safe area handling

## 🔧 Development

### Adding New Features

1. **New Screen:**
   - Add to `src/screens/`
   - Add route to `AppNavigator.tsx`
   - Update `RootStackParamList` in `src/types/index.ts`

2. **New Component:**
   - Add to `src/components/`
   - Follow existing component patterns

3. **New Utility:**
   - Add to `src/utils/`
   - Export from index if needed

## 🐛 Troubleshooting

### Vector Icons Not Showing

**iOS:**
```bash
cd ios && pod install && cd ..
```

**Android:**
Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### Metro Bundler Issues

```bash
yarn start --reset-cache
```

### Build Issues

**Android:**
```bash
cd android && ./gradlew clean && cd ..
```

**iOS:**
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## 📝 Notes

- The app uses a dummy in-memory user database. In production, replace with API calls.
- AsyncStorage is used for persistence but can be replaced with secure storage for production.
- All validation is client-side. Add server-side validation for production.

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Created as a demonstration of React Native authentication patterns.

---

**Happy Coding! 🚀**
