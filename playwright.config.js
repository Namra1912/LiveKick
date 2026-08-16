
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scratch',
  use: {
    baseURL: 'http://localhost:5173',
  },
});
