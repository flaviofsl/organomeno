import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import CardComponent from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const DetalhesArquivoOfx = () => {
  const toast = useToast();
  const history = useHistory();
  const { id } = useParams();
  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarDetalhes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ofx/${id}/detalhes`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os detalhes do arquivo.");
      }
      const data = await response.json();
      setDetalhes(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar detalhes",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    carregarDetalhes();
  }, [carregarDetalhes]);

  const formatarData = (data) => {
    if (!data) return "-";
    try {
      const dataObj = new Date(data);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dataObj);
    } catch (error) {
      return "-";
    }
  };

  const formatarDataSimples = (data) => {
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

  const formatarTipoMovimentacao = (tipo) => {
    if (tipo === "ENTRADA") {
      return <Badge colorScheme="green">Entrada</Badge>;
    } else if (tipo === "SAIDA") {
      return <Badge colorScheme="red">Saída</Badge>;
    }
    return <Badge>{tipo || "-"}</Badge>;
  };

  if (loading) {
    return (
      <Box pt="80px" display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!detalhes || !detalhes.arquivo) {
    return (
      <Box pt="80px">
        <CardComponent w="100%" p="24px">
          <Text textAlign="center" color="gray.500">
            Arquivo não encontrado.
          </Text>
        </CardComponent>
      </Box>
    );
  }

  const { arquivo, receitas, despesas, movimentacoes } = detalhes;

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <CardComponent w="100%" p="24px">
          <Flex align="center" justify="space-between" mb="20px">
            <Flex align="center" gap="12px">
              <Button
                leftIcon={<MdArrowBack />}
                variant="ghost"
                onClick={() => history.push('/admin/movimentacoes/importar-ofx')}
              >
                Voltar
              </Button>
              <Text fontSize="xl" fontWeight="bold">
                Detalhes do Arquivo OFX
              </Text>
            </Flex>
          </Flex>

          <Divider mb="24px" />

          {/* Informações do Arquivo */}
          <Box mb="32px">
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Informações do Arquivo
            </Text>
            <SimpleGrid columns={2} gap="16px">
              <Box>
                <Text fontSize="sm" color="gray.500" mb="4px">
                  Nome do Arquivo
                </Text>
                <Text fontSize="md" fontWeight="medium">
                  {arquivo.nomeArquivo}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb="4px">
                  Conta
                </Text>
                <Text fontSize="md" fontWeight="medium">
                  {arquivo.nomeConta}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb="4px">
                  Data de Importação
                </Text>
                <Text fontSize="md" fontWeight="medium">
                  {formatarData(arquivo.dataImportacao)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb="4px">
                  Resumo
                </Text>
                <Flex gap="12px">
                  <Badge colorScheme="green">
                    {arquivo.quantidadeReceitas || 0} Receitas
                  </Badge>
                  <Badge colorScheme="red">
                    {arquivo.quantidadeDespesas || 0} Despesas
                  </Badge>
                </Flex>
              </Box>
            </SimpleGrid>
          </Box>

          <Divider mb="24px" />

          {/* Receitas Importadas */}
          <Box mb="32px">
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Receitas Importadas ({receitas?.length || 0})
            </Text>
            {receitas && receitas.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Descrição</Th>
                    <Th>Categoria</Th>
                    <Th>Valor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {receitas.map((receita) => (
                    <Tr key={receita.id}>
                      <Td>{formatarDataSimples(receita.dataEntrada || receita.dataCadastro)}</Td>
                      <Td>{receita.descricao || "-"}</Td>
                      <Td>{receita.categoria || "-"}</Td>
                      <Td>
                        <Text fontWeight="bold" color="green.500">
                          {formatarValor(receita.valorBruto)}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center" color="gray.500" py="20px">
                Nenhuma receita foi importada deste arquivo.
              </Text>
            )}
          </Box>

          <Divider mb="24px" />

          {/* Despesas Importadas */}
          <Box mb="32px">
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Despesas Importadas ({despesas?.length || 0})
            </Text>
            {despesas && despesas.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Descrição</Th>
                    <Th>Categoria</Th>
                    <Th>Valor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {despesas.map((despesa) => (
                    <Tr key={despesa.id}>
                      <Td>{formatarDataSimples(despesa.dataCadastro)}</Td>
                      <Td>{despesa.descricao || "-"}</Td>
                      <Td>{despesa.categoria || "-"}</Td>
                      <Td>
                        <Text fontWeight="bold" color="red.500">
                          {formatarValor(despesa.valorBruto)}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center" color="gray.500" py="20px">
                Nenhuma despesa foi importada deste arquivo.
              </Text>
            )}
          </Box>

          <Divider mb="24px" />

          {/* Movimentações */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Movimentações Lançadas ({movimentacoes?.length || 0})
            </Text>
            {movimentacoes && movimentacoes.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Descrição</Th>
                    <Th>Tipo</Th>
                    <Th>Valor</Th>
                    <Th>Conta</Th>
                    <Th>Receita</Th>
                    <Th>Despesa</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {movimentacoes.map((movimentacao) => (
                    <Tr key={movimentacao.id}>
                      <Td>{formatarData(movimentacao.dataMovimentacao)}</Td>
                      <Td>{movimentacao.descricao || "-"}</Td>
                      <Td>{formatarTipoMovimentacao(movimentacao.tipoMovimentacao)}</Td>
                      <Td>
                        <Text
                          fontWeight="bold"
                          color={movimentacao.tipoMovimentacao === "ENTRADA" ? "green.500" : "red.500"}
                        >
                          {formatarValor(movimentacao.valor)}
                        </Text>
                      </Td>
                      <Td>{movimentacao.nomeConta || "-"}</Td>
                      <Td>{movimentacao.descricaoReceita || "-"}</Td>
                      <Td>{movimentacao.descricaoDespesa || "-"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center" color="gray.500" py="20px">
                Nenhuma movimentação foi lançada a partir deste arquivo.
              </Text>
            )}
          </Box>
        </CardComponent>
      </SimpleGrid>
    </Box>
  );
};

export default DetalhesArquivoOfx;

