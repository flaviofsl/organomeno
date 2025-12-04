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

const Contas = () => {
  const toast = useToast();
  const history = useHistory();
  const [contas, setContas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 5;

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(contas.length / ITENS_POR_PAGINA));
  }, [contas.length]);

  const contasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return contas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [contas, pagina]);

  const buscarContas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as contas cadastradas.");
      }
      const data = await response.json();
      setContas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar contas",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setContas([]);
    }
  }, [toast]);

  useEffect(() => {
    buscarContas();
  }, [buscarContas]);

  // Resetar para página 1 quando os dados mudarem
  useEffect(() => {
    setPagina(1);
  }, [contas.length]);

  const abrirCadastroConta = () => {
    history.push('/admin/contas/nova');
  };

  const abrirEdicaoConta = (id) => {
    history.push(`/admin/contas/editar/${id}`);
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

  const formatarTipoConta = (tipo) => {
    const tipos = {
      CORRENTE: "Corrente",
      POUPANCA: "Poupança",
      SALARIO: "Salário",
      INVESTIMENTO: "Investimento",
    };
    return tipos[tipo] || tipo;
  };

  const formatarSaldo = (saldo) => {
    if (!saldo || saldo === "" || saldo === null || saldo === undefined) {
      return "R$ 0,00";
    }
    const valor = parseFloat(String(saldo).replace(",", "."));
    if (isNaN(valor)) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="12px">
            <Text fontSize="lg" fontWeight="bold">
              Contas bancárias cadastradas
            </Text>
            <Button colorScheme="brand" onClick={abrirCadastroConta}>
              Cadastrar conta
            </Button>
          </Flex>
          <Table
            variant="simple"
            size="sm"
            style={{ tableLayout: "fixed" }}
            width="100%"
          >
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <Thead>
              <Tr>
                <Th fontSize="md" py="8px">Nome</Th>
                <Th fontSize="md" py="8px">Banco</Th>
                <Th fontSize="md" py="8px">Agência</Th>
                <Th fontSize="md" py="8px">Número</Th>
                <Th fontSize="md" py="8px">Tipo</Th>
                <Th fontSize="md" py="8px">Saldo Atual</Th>
                <Th fontSize="md" py="8px">Status</Th>
                <Th fontSize="md" py="8px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contasPaginadas && contasPaginadas.length > 0 ? (
                contasPaginadas.map((conta) => (
                  <Tr key={conta.id}>
                    <Td fontSize="md" py="8px">{conta.nome || "-"}</Td>
                    <Td fontSize="md" py="8px">{conta.banco || "-"}</Td>
                    <Td fontSize="md" py="8px">{conta.agencia || "-"}</Td>
                    <Td fontSize="md" py="8px">{conta.numeroConta || "-"}</Td>
                    <Td fontSize="md" py="8px">{formatarTipoConta(conta.tipoConta || "")}</Td>
                    <Td fontSize="md" py="8px">
                      <Text 
                        fontWeight="bold" 
                        color={parseFloat(conta.saldoAtual || conta.saldoInicial || 0) >= 0 ? "green.500" : "red.500"}
                      >
                        {formatarSaldo(conta.saldoAtual || conta.saldoInicial || "0")}
                      </Text>
                    </Td>
                    <Td fontSize="md" py="8px">
                      <Badge colorScheme={conta.ativa ? "green" : "red"}>
                        {conta.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </Td>
                    <Td fontSize="md" py="8px">
                      <IconButton
                        icon={<MdEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => abrirEdicaoConta(conta.id)}
                        aria-label="Editar conta"
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={8} fontSize="md" py="8px">
                    <Text textAlign="center" color="gray.500">
                      Nenhuma conta cadastrada até o momento.
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

export default Contas;

