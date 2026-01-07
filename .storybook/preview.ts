import type { Preview } from '@storybook/nextjs-vite'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../src/theme'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f5f5f5',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
    options: {
      storySort: {
        order: ['Components'],
      },
    },
  },
  decorators: [
    (Story) => React.createElement(ChakraProvider, { theme }, React.createElement(Story)),
  ],
};

export default preview;