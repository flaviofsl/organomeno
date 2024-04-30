import { useMemo } from "react";
import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";

import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

export default function ColumnsTable({data, tipo, corValor}) {

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "DESCRICAO",
        accessor: "descricao"
      },
      {
        Header: "CATEGORIA",
        accessor: "categoria",
      },
      {
        Header: "DATA TRANSACAO",
        accessor: "dataCadastro",
      },
      {
        Header: "VALOR BRUTO",
        accessor: "valorBruto",
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,      
    },
    useGlobalFilter,
    useSortBy,    
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
 


  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          {tipo}
        </Text>
        <Menu />
      </Flex>
      <Box maxH="400px" overflowY="auto">
        <Table
          {...getTableProps()}
          variant="simple"
          color="gray.500"
          mb="24px"          
        >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = cell.value;
                    if (cell.column.Header === "ID") {
                      data = (
                        <Flex align="center">
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "DESCRICAO") {
                      data = (
                        <Flex>
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell.value.length > 20 ? `${cell.value.slice(0, 20)}...` : cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "CATEGORIA") {
                      data = (
                        <Flex align="center">
                          <Text
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "DATA TRANSACAO") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {new Date(cell.value).toLocaleDateString("pt-BR")}
                        </Text>
                      );
                    } else if (cell.column.Header === "VALOR BRUTO") {
                      data = (
                        <Text color={corValor} fontSize="sm" fontWeight="700">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(cell.value)}
                        </Text>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
