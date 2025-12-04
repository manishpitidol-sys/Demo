// Extend Jest matchers for React Native testing

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage: Record<string, string> = {};

  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => {
        return Promise.resolve(storage[key] || null);
      }),
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(storage).forEach((key) => delete storage[key]);
        return Promise.resolve();
      }),
    },
  };
});

// Mock React Navigation
export const mockNavigate = jest.fn();
export const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Suppress act warnings from TouchableOpacity animations
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('Warning: An update to ForwardRef inside a test was not wrapped in act(...)') ||
      message.includes('not wrapped in act(...)') ||
      (message.includes('act(...)') && message.includes('ForwardRef'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Reset mocks before each test
beforeEach(() => {
  mockNavigate.mockClear();
  mockGoBack.mockClear();
});

