'use client'

import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Text,
  Flex,
  Switch,
  useColorMode,
} from '@chakra-ui/react'
import {
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiFileText,
  FiHeadphones,
  FiRepeat,
  FiExternalLink,
} from 'react-icons/fi'

export interface ProfileMenuItem {
  id: string
  label: string
  icon?: React.ElementType
  onClick: () => void
  divider?: boolean
  externalLink?: boolean // For items that open external links
}

export interface TopNavProps {
  logo?: React.ReactNode
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  userInitials?: string
  userName?: string
  userRole?: string // Role name (e.g., "Super Admin")
  userEmail?: string
  profileMenuItems?: ProfileMenuItem[]
  onLogout?: () => void
  // Legacy support for old userMenuItems prop
  userMenuItems?: Array<{
    label: string
    onClick: () => void
  }>
}

export function TopNav({
  logo,
  searchPlaceholder = 'Accounts, customers...',
  onSearch,
  userInitials = 'DA',
  userName = 'Demo User',
  userRole,
  userEmail = 'demo@cyberqp.com',
  profileMenuItems,
  onLogout,
  userMenuItems, // Legacy support
}: TopNavProps) {
  const { colorMode, toggleColorMode } = useColorMode()

  // Convert legacy userMenuItems to profileMenuItems if provided
  const legacyMenuItems: ProfileMenuItem[] | undefined = userMenuItems?.map((item, index) => ({
    id: `legacy-${index}`,
    label: item.label,
    onClick: item.onClick,
  }))

  const defaultMenuItems: ProfileMenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: FiUser,
      onClick: () => console.log('Profile clicked'),
    },
    {
      id: 'tenant-settings',
      label: 'Tenant settings',
      icon: FiSettings,
      onClick: () => console.log('Tenant settings clicked'),
    },
    {
      id: 'notification-preference',
      label: 'Notification preference',
      icon: FiRepeat,
      onClick: () => console.log('Notification preference clicked'),
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: FiFileText,
      externalLink: true,
      onClick: () => console.log('Documentation clicked'),
    },
    {
      id: 'contact-support',
      label: 'Contact support',
      icon: FiHeadphones,
      externalLink: true,
      onClick: () => console.log('Contact support clicked'),
    },
  ]

  const menuItems = profileMenuItems || legacyMenuItems || defaultMenuItems
  return (
    <Box
      as="nav"
      bg="gray.50"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={3}
      py={2}
      h="48px"
      maxH="48px"
      w="full"
      display="flex"
      alignItems="center"
      _dark={{
        bg: 'gray.900',
        borderColor: 'gray.700',
      }}
    >
      <HStack spacing={6} justify="space-between" align="center" w="full" h="full">
        {/* Logo */}
        <Box flexShrink={0}>
          {logo || (
            <Box
              w={8}
              h={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              <Image
                src="/a901fcbcd4c48aad5346499a7eea238bb5bdd7b8.svg"
                alt="CyberQP Logo"
                w="full"
                h="full"
                objectFit="contain"
              />
            </Box>
          )}
        </Box>

        {/* Search Bar */}
        <Box flexShrink={0} w="350px" mx="auto">
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="32px">
              <Icon as={FiSearch} color="gray.400" fontSize="md" />
            </InputLeftElement>
            <Input
              placeholder={searchPlaceholder}
              bg="white"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _dark={{
                bg: 'gray.800',
                borderColor: 'gray.600',
                _hover: { borderColor: 'gray.500' },
              }}
              onChange={(e) => onSearch?.(e.target.value)}
              h="32px"
              fontSize="sm"
            />
          </InputGroup>
        </Box>

        {/* User Avatar/Menu */}
        <Box flexShrink={0}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="User menu"
              icon={
                <Box
                  w={8}
                  h={8}
                  borderRadius="md"
                  bg="gray.800"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="medium"
                  fontSize="sm"
                  _dark={{
                    bg: 'gray.700',
                  }}
                >
                  {userInitials}
                </Box>
              }
              variant="ghost"
              p={0}
              minW="auto"
              h="auto"
              _hover={{ opacity: 0.8 }}
              _active={{ opacity: 0.9 }}
            />
            <MenuList
              minW="240px"
              _dark={{
                bg: 'gray.800',
                borderColor: 'gray.700',
              }}
            >
              {/* User Info Section */}
              <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.200" _dark={{ borderColor: 'gray.700' }}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900" _dark={{ color: 'white' }}>
                  {userName}
                </Text>
                {userRole && (
                  <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }} mt={0.5}>
                    {userRole}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }} mt={userRole ? 0.5 : 0}>
                  {userEmail}
                </Text>
              </Box>

              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <Box key={item.id}>
                  {item.divider && index > 0 && <MenuDivider />}
                  <MenuItem
                    onClick={item.onClick}
                    icon={item.icon ? <Icon as={item.icon} /> : undefined}
                    _dark={{
                      _hover: {
                        bg: 'gray.700',
                      },
                    }}
                  >
                    <HStack spacing={2} flex={1} justify="space-between">
                      <Text>{item.label}</Text>
                      {item.externalLink && (
                        <Icon as={FiExternalLink} fontSize="xs" color="gray.400" />
                      )}
                    </HStack>
                  </MenuItem>
                </Box>
              ))}

              {/* Dark Mode Toggle */}
              <MenuDivider />
              <Flex
                px={4}
                py={2}
                align="center"
                justify="space-between"
                _dark={{
                  _hover: {
                    bg: 'gray.700',
                  },
                }}
              >
                <HStack spacing={2}>
                  <Icon as={colorMode === 'dark' ? FiMoon : FiSun} />
                  <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
                    Dark mode
                  </Text>
                </HStack>
                <Switch
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                  colorScheme="green"
                  size="sm"
                />
              </Flex>

              {/* Logout */}
              {onLogout && (
                <>
                  <MenuDivider />
                  <MenuItem
                    onClick={onLogout}
                    icon={<Icon as={FiLogOut} />}
                    color="red.500"
                    _dark={{
                      color: 'red.400',
                      _hover: {
                        bg: 'gray.700',
                      },
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Box>
  )
}

