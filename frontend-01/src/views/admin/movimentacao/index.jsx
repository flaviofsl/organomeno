import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { SearchIcon, SettingsIcon, EmailIcon, ChevronLeftIcon, ChevronRightIcon, AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'

export default function Component() {
  const bgColor = useColorModeValue('gray.100', 'gray.700')
  const sidebarBgColor = useColorModeValue('blue.800', 'blue.900')
  const sidebarColor = useColorModeValue('white', 'gray.200')
  const rightSidebarBgColor = useColorModeValue('white', 'gray.800')

  const [selectedMonth, setSelectedMonth] = useState('JUN')
  const [selectedYear, setSelectedYear] = useState('2016')

  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  const years = ['2016', '2017', '2018', '2019', '2020']

  return (
    <Flex h="100vh">
 
      {/* Main Content */}
      <Box flex={1} p={8} bg={bgColor}>
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold">Movimentações</Text>
            <HStack>
              <IconButton aria-label="Search" icon={<SearchIcon />} />
              <IconButton aria-label="Settings" icon={<SettingsIcon />} />
              <IconButton aria-label="Notifications" icon={<EmailIcon />} />
            </HStack>
          </Flex>

          {/* Tabs */}
          <HStack>
            <Button colorScheme="green">Recebimentos</Button>
            <Button variant="ghost">Despesas fixas</Button>
            <Button variant="ghost">Despesas variáveis</Button>
            <Button variant="ghost">Pessoas</Button>
            <Button variant="ghost">Impostos</Button>
            <Button variant="ghost">Transferências</Button>
          </HStack>

          {/* Action Buttons and Month Filter */}
          <Flex justify="space-between" align="center">
            <Button leftIcon={<AddIcon />} colorScheme="green">
              Adicionar novo recebimento
            </Button>
            <HStack>
              <IconButton aria-label="Previous month" icon={<ChevronLeftIcon />} />
              <Button variant="outline">
                {selectedMonth} {selectedYear}
              </Button>
              <Button variant="outline">
                {selectedMonth} {selectedYear}
              </Button>
              <Button variant="outline">
                {selectedMonth} {selectedYear}
              </Button>
              <IconButton aria-label="Next month" icon={<ChevronRightIcon />} />
            </HStack>
          </Flex>

          {/* Table */}
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>DATA</Th>
                <Th>DESCRIÇÃO</Th>
                <Th>RECEBIDO DE</Th>
                <Th>VALOR</Th>
                <Th>CATEGORIA</Th>
                <Th>AÇÕES</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>10/06</Td>
                <Td>Hospedagem  </Td>
                <Td>   Nova</Td>
                <Td>R$ 300,00</Td>
                <Td>Depósito</Td>
                <Td>
                  <HStack>
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" />
                    <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" />
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Td>10/06</Td>
                <Td>Sistema Newsletter</Td>
                <Td>    Nova</Td>
                <Td>R$ 450,00</Td>
                <Td>Depósito</Td>
                <Td>
                  <HStack>
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" />
                    <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" />
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Td>10/06</Td>
                <Td>Manutenção  </Td>
                <Td>Willow </Td>
                <Td>R$ 450,00</Td>
                <Td>Depósito</Td>
                <Td>
                  <HStack>
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" />
                    <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" />
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </VStack>
      </Box>

      {/* Right Sidebar */}
      <VStack w="300px" bg={rightSidebarBgColor} p={4} spacing={4} align="stretch">
        <Box borderWidth={1} borderRadius="md" p={4}>
          <Text fontWeight="bold">Saldo — Conta Principal (P)</Text>
          <Text color="green.500" fontSize="2xl">R$ 16.620,06</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">{selectedMonth} / {selectedYear}</Text>
          <Text>VOCÊ FECHOU O MÊS ANTERIOR COM O BALANÇO DE:</Text>
          <Text fontSize="xl" fontWeight="bold">R$ 15.620,06</Text>
          <Text mt={2}>PARA O MÊS ATUAL, A PREVISÃO DE FECHAMENTO É:</Text>
          <Text fontSize="xl" fontWeight="bold">R$ 23.270,06</Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight="bold">RECEBIMENTOS</Text>
          <Flex justify="space-between">
            <Text>realizado:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>previsto:</Text>
            <Text>R$ 7.650,00</Text>
          </Flex>
        </Box>
        <Box>
          <Text fontWeight="bold">SAÍDAS TOTAIS</Text>
          <Flex justify="space-between">
            <Text>realizado:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>previsto:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
        </Box>
        <Box>
          <Text fontWeight="bold">DESPESAS FIXAS</Text>
          <Flex justify="space-between">
            <Text>realizado:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>previsto:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
        </Box>
        <Box>
          <Text fontWeight="bold">DESPESAS VARIÁVEIS</Text>
          <Flex justify="space-between">
            <Text>realizado:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>previsto:</Text>
            <Text>R$ 0,00</Text>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  )
}