// Jest setup file for TaskFlow
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
        return null;
      }),
      getItem: jest.fn(async (key: string) => {
        return store[key] !== undefined ? store[key] : null;
      }),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
        return null;
      }),
      clear: jest.fn(async () => {
        store = {};
        return null;
      }),
      getAllKeys: jest.fn(async () => Object.keys(store)),
    },
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn().mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    }),
    addEventListener: jest.fn(() => jest.fn()),
  },
}));

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockPicker = (props: any) => React.createElement(View, { testID: 'native-date-time-picker', ...props });
  MockPicker.open = jest.fn();
  MockPicker.dismiss = jest.fn();
  return {
    __esModule: true,
    default: MockPicker,
    DateTimePickerAndroid: {
      open: jest.fn(),
      dismiss: jest.fn(),
    },
  };
});

// Mock react-native-document-picker
jest.mock('react-native-document-picker', () => ({
  pick: jest.fn().mockResolvedValue([
    {
      uri: 'file:///mock/document.pdf',
      name: 'invoice_receipt.pdf',
      type: 'application/pdf',
      size: 1542000,
    },
  ]),
  isCancel: jest.fn().mockReturnValue(false),
  types: {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    plainText: 'text/plain',
    allFiles: '*/*',
  },
}));
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn().mockImplementation((options, callback) => {
    const res = {
      assets: [{ uri: 'file:///mock/path/camera.jpg', fileName: 'camera.jpg', fileSize: 1024000 }],
    };
    if (callback) callback(res);
    return Promise.resolve(res);
  }),
  launchImageLibrary: jest.fn().mockImplementation((options, callback) => {
    const res = {
      assets: [{ uri: 'file:///mock/path/photo.jpg', fileName: 'photo.jpg', fileSize: 2048000 }],
    };
    if (callback) callback(res);
    return Promise.resolve(res);
  }),
}));
