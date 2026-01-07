import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.900',
      },
    }),
  },
  colors: {
    brand: {
      50: '#e6f3ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6', // Primary brand color
      600: '#005cb3',
      700: '#004580',
      800: '#002e4d',
      900: '#00171a',
    },
    // Grey color palette for CyberQP
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Green color palette for CyberQP
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Primary green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'green',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'blue.500', // Default inverted border color for all inputs
      },
    },
    Table: {
      baseStyle: {
        th: {
          fontWeight: 400,
          textTransform: 'none',
          letterSpacing: 'normal',
          bg: 'grey.50',
          color: 'grey.900',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        },
        td: {
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        },
      },
      variants: {
        simple: {
          th: {
            borderBottom: '1px solid',
            borderColor: 'grey.200',
          },
        },
        striped: {
          tbody: {
            tr: {
              '&:nth-of-type(odd)': {
                bg: 'grey.50',
              },
            },
          },
        },
      },
    },
  },
})

export { theme }

