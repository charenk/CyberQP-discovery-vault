'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Card,
  CardBody,
  Button,
} from '@chakra-ui/react'
import { FiUsers, FiShield, FiClock, FiAlertCircle } from 'react-icons/fi'
import NextLink from 'next/link'

export default function Home() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>
              CyberQP Dashboard
            </Heading>
            <Text color="gray.600">
              Privileged Access Management Platform
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Sessions</StatLabel>
                  <StatNumber>24</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12% from last week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Pending Requests</StatLabel>
                  <StatNumber>8</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    3 from yesterday
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber>156</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    5 new this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Security Alerts</StatLabel>
                  <StatNumber>2</StatNumber>
                  <StatHelpText color="red.500">
                    Requires attention
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Quick Actions
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">
                  Welcome to CyberQP! Start by exploring the navigation menu.
                </Text>
                <HStack>
                  <Button as={NextLink} href="/table-demo" colorScheme="green">
                    View DataTable Demo
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

