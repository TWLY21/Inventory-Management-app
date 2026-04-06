import {Platform} from 'react-native';

const ANDROID_EMULATOR_BASE_URL = 'http://10.0.2.2:5000/api';
const IOS_SIMULATOR_BASE_URL = 'http://localhost:5000/api';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? ANDROID_EMULATOR_BASE_URL
    : IOS_SIMULATOR_BASE_URL;
