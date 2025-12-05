import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import Card from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const Despesas = () => {
  const toast = useToast();
  const history = useHistory();
  const [despesas, setDespesas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 5;

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(despesas.length / ITENS_POR_PAGINA));
  }, [despesas.length]);

  const despesasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return despesas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [despesas, pagina]);

  const buscarDespesas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/todos`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as despesas cadastradas.");
      }
      const data = await response.json();
      setDespesas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar despesas",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setDespesas([]);
    }
  }, [toast]);

  useEffect(() => {
    buscarDespesas();
  }, [buscarDespesas]);

  // Resetar para página 1 quando os dados mudarem
  useEffect(() => {
    setPagina(1);
  }, [despesas.length]);

  const abrirCadastroDespesa = () => {
    history.push('/admin/despesas/nova');
  };

  const abrirEdicaoDespesa = (id) => {
    history.push(`/admin/despesas/editar/${id}`);
  };

  const renderPaginas = () => {
    const limite = 5;
    let inicio = Math.max(1, pagina - Math.floor(limite / 2));
    let fim = inicio + limite - 1;
    if (fim > totalPaginas) {
      fim = totalPaginas;
      inicio = Math.max(1, fim - limite + 1);
    }
    let retorno = [];
    for (let i = inicio; i <= fim; i++) {
      retorno.push(
        <Button
          key={i}
          size="sm"
          variant={pagina === i ? "solid" : "outline"}
          onClick={() => setPagina(i)}
          isDisabled={pagina === i}
        >
          {i}
        </Button>
      );
    }
    return retorno;
  };

  const formatarValor = (valor) => {
    if (!valor || valor === "" || valor === null || valor === undefined) {
      return "R$ 0,00";
    }
    const valorNum = parseFloat(String(valor).replace(",", "."));
    if (isNaN(valorNum)) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorNum);
  };

  const formatarData = (data) => {
    if (!data) return "-";
    try {
      const dataObj = new Date(data);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dataObj);
    } catch (error) {
      return "-";
    }
  };

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="12px">
            <Text fontSize="lg" fontWeight="bold">
              Lançamentos de despesas
            </Text>
            <Button colorScheme="brand" onClick={abrirCadastroDespesa}>
              Cadastrar despesa
            </Button>
          </Flex>
          <Table
            variant="simple"
            size="sm"
            style={{ tableLayout: "fixed" }}
            width="100%"
          >
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <Thead>
              <Tr>
                <Th fontSize="md" py="8px">Categoria</Th>
                <Th fontSize="md" py="8px">Descrição</Th>
                <Th fontSize="md" py="8px">Valor</Th>
                <Th fontSize="md" py="8px">Data Cadastro</Th>
                <Th fontSize="md" py="8px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {despesasPaginadas && despesasPaginadas.length > 0 ? (
                despesasPaginadas.map((despesa) => (
                  <Tr key={despesa.id}>
                    <Td fontSize="md" py="8px">{despesa.categoria || "-"}</Td>
                    <Td fontSize="md" py="8px">{despesa.descricao || "-"}</Td>
                    <Td fontSize="md" py="8px">
                      <Text fontWeight="bold" color="red.500">
                        {formatarValor(despesa.valorBruto || 0)}
                      </Text>
                    </Td>
                    <Td fontSize="md" py="8px">{formatarData(despesa.dataCadastro)}</Td>
                    <Td fontSize="md" py="8px">
                      <IconButton
                        icon={<MdEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => abrirEdicaoDespesa(despesa.id)}
                        aria-label="Editar despesa"
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} fontSize="md" py="8px">
                    <Text textAlign="center" color="gray.500">
                      Nenhuma despesa cadastrada até o momento.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <Flex align="center" justify="space-between" mt="16px">
            <Text fontSize="sm" color="gray.500">
              Página {pagina} de {totalPaginas}
            </Text>
            <Flex gap="8px">
              {renderPaginas()}
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Despesas;

