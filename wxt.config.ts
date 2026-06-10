import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'Mindlex Translator',
    description:
      'Browser extension for AI-assisted translation and vocabulary capture.',
    version: '0.1',
    permissions: ['activeTab', 'contextMenus', 'storage'],
    action: {
      default_title: 'Mindlex Translator',
    },
  },
  modules: ['@wxt-dev/module-react'],
});
