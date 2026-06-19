import { storage } from 'wxt/utils/storage';
import {
  DEFAULT_EXTENSION_SETTINGS,
  EXTENSION_SETTINGS_STORAGE_KEY,
  ExtensionSettings,
} from '../settings';

const settings = storage.defineItem<ExtensionSettings>(
  `local:${EXTENSION_SETTINGS_STORAGE_KEY}`,
  {
    fallback: DEFAULT_EXTENSION_SETTINGS,
  },
);

export async function getSettings() {
  return settings.getValue();
}

export async function saveSettings(value: ExtensionSettings) {
  return settings.setValue(value);
}
