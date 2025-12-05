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
  IconButton,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import Card from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const Receitas = () => {
  const toast = useToast();
  const history = useHistory();
  const [receitas, setReceitas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 5;

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(receitas.length / ITENS_POR_PAGINA));
  }, [receitas.length]);

  const receitasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return receitas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [receitas, pagina]);

  const buscarReceitas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/receitas/todos`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as receitas cadastradas.");
      }
      const data = await response.json();
      setReceitas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar receitas",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setReceitas([]);
    }
  }, [toast]);

  useEffect(() => {
    buscarReceitas();
  }, [buscarReceitas]);

  // Resetar para página 1 quando os dados mudarem
  useEffect(() => {
    setPagina(1);
  }, [receitas.length]);

  const abrirCadastroReceita = () => {
    history.push('/admin/receitas/nova');
  };

  const abrirEdicaoReceita = (id) => {
    history.push(`/admin/receitas/editar/${id}`);
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
              Lançamentos de receitas
            </Text>
            <Button colorScheme="brand" onClick={abrirCadastroReceita}>
              Cadastrar receita
            </Button>
          </Flex>
          <Table
            variant="simple"
            size="sm"
            style={{ tableLayout: "fixed" }}
            width="100%"
          >
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <Thead>
              <Tr>
                <Th fontSize="md" py="8px">Descrição</Th>
                <Th fontSize="md" py="8px">Valor</Th>
                <Th fontSize="md" py="8px">Data Cadastro</Th>
                <Th fontSize="md" py="8px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {receitasPaginadas && receitasPaginadas.length > 0 ? (
                receitasPaginadas.map((receita) => (
                  <Tr key={receita.id}>
                    <Td fontSize="md" py="8px">{receita.descricao || "-"}</Td>
                    <Td fontSize="md" py="8px">
                      <Text fontWeight="bold" color="green.500">
                        {formatarValor(receita.valorBruto || 0)}
                      </Text>
                    </Td>
                    <Td fontSize="md" py="8px">{formatarData(receita.dataEntrada || receita.dataCadastro)}</Td>
                    <Td fontSize="md" py="8px">
                      <IconButton
                        icon={<MdEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => abrirEdicaoReceita(receita.id)}
                        aria-label="Editar receita"
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} fontSize="md" py="8px">
                    <Text textAlign="center" color="gray.500">
                      Nenhuma receita cadastrada até o momento.
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

export default Receitas;

