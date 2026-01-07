import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/nextjs-vite",
  "features": {
    "buildStoriesJson": false
  },
  "viteFinal": async (config) => {
    // Remove 'use client' directives that cause bundling issues
    config.plugins = config.plugins || []
    return config
  }
};
export default config;