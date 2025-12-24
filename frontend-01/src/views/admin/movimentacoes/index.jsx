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

const Movimentacoes = () => {
  const toast = useToast();
  const history = useHistory();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 5;

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(movimentacoes.length / ITENS_POR_PAGINA));
  }, [movimentacoes.length]);

  const movimentacoesPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return movimentacoes.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [movimentacoes, pagina]);

  const buscarMovimentacoes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movimentacoes`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as movimentações cadastradas.");
      }
      const data = await response.json();
      setMovimentacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar movimentações",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setMovimentacoes([]);
    }
  }, [toast]);

  useEffect(() => {
    buscarMovimentacoes();
  }, [buscarMovimentacoes]);

  // Resetar para página 1 quando os dados mudarem
  useEffect(() => {
    setPagina(1);
  }, [movimentacoes.length]);

  const abrirCadastroMovimentacao = () => {
    history.push('/admin/movimentacoes/nova');
  };

  const abrirEdicaoMovimentacao = (id) => {
    history.push(`/admin/movimentacoes/editar/${id}`);
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

  const formatarTipoMovimentacao = (tipo) => {
    if (tipo === "ENTRADA") {
      return <Badge colorScheme="green">Entrada</Badge>;
    } else if (tipo === "SAIDA") {
      return <Badge colorScheme="red">Saída</Badge>;
    }
    return <Badge>{tipo || "-"}</Badge>;
  };

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="12px">
            <Text fontSize="lg" fontWeight="bold">
              Lançamentos de movimentações
            </Text>
            <Flex gap="8px">
              <Button colorScheme="blue" onClick={() => history.push('/admin/movimentacoes/importar-ofx')}>
                Importar OFX
              </Button>
              <Button colorScheme="brand" onClick={abrirCadastroMovimentacao}>
                Cadastrar movimentação
              </Button>
            </Flex>
          </Flex>
          <Table
            variant="simple"
            size="sm"
            style={{ tableLayout: "fixed" }}
            width="100%"
          >
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <Thead>
              <Tr>
                <Th fontSize="md" py="8px">Conta</Th>
                <Th fontSize="md" py="8px">Receita</Th>
                <Th fontSize="md" py="8px">Despesa</Th>
                <Th fontSize="md" py="8px">Descrição</Th>
                <Th fontSize="md" py="8px">Tipo</Th>
                <Th fontSize="md" py="8px">Valor</Th>
                <Th fontSize="md" py="8px">Data</Th>
                <Th fontSize="md" py="8px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {movimentacoesPaginadas && movimentacoesPaginadas.length > 0 ? (
                movimentacoesPaginadas.map((movimentacao) => (
                  <Tr key={movimentacao.id}>
                    <Td fontSize="md" py="8px">{movimentacao.nomeConta || "-"}</Td>
                    <Td fontSize="md" py="8px">{movimentacao.descricaoReceita || "-"}</Td>
                    <Td fontSize="md" py="8px">{movimentacao.descricaoDespesa || "-"}</Td>
                    <Td fontSize="md" py="8px">{movimentacao.descricao || "-"}</Td>
                    <Td fontSize="md" py="8px">{formatarTipoMovimentacao(movimentacao.tipoMovimentacao)}</Td>
                    <Td fontSize="md" py="8px">
                      <Text 
                        fontWeight="bold" 
                        color={movimentacao.tipoMovimentacao === "ENTRADA" ? "green.500" : "red.500"}
                      >
                        {formatarValor(movimentacao.valor || 0)}
                      </Text>
                    </Td>
                    <Td fontSize="md" py="8px">{formatarData(movimentacao.dataMovimentacao)}</Td>
                    <Td fontSize="md" py="8px">
                      <IconButton
                        icon={<MdEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => abrirEdicaoMovimentacao(movimentacao.id)}
                        aria-label="Editar movimentação"
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} fontSize="md" py="8px">
                    <Text textAlign="center" color="gray.500">
                      Nenhuma movimentação cadastrada até o momento.
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

export default Movimentacoes;

