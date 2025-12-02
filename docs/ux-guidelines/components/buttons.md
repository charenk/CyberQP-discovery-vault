# Button Component Guidelines

## Overview
Buttons are used for primary actions throughout the CyberQP application.

## Use Cases
- Submit forms
- Navigate between pages
- Trigger actions (approve, revoke, etc.)
- Confirm critical operations

## Error States
- Disabled state when action is not available
- Loading state during async operations
- Error feedback via toast notifications

## Examples
```tsx
// Primary action
<Button colorScheme="brand">Approve Request</Button>

// Destructive action
<Button colorScheme="red">Revoke Access</Button>

// Loading state
<Button isLoading>Processing...</Button>
```

