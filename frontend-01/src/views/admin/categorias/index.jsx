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
import { MdEdit, MdDelete } from "react-icons/md";
import Card from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const Categorias = () => {
  const toast = useToast();
  const history = useHistory();
  const [categorias, setCategorias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 5;

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(categorias.length / ITENS_POR_PAGINA));
  }, [categorias.length]);

  const categoriasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return categorias.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [categorias, pagina]);

  const buscarCategorias = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as categorias cadastradas.");
      }
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar categorias",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setCategorias([]);
    }
  }, [toast]);

  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  // Resetar para página 1 quando os dados mudarem
  useEffect(() => {
    setPagina(1);
  }, [categorias.length]);

  const abrirCadastroCategoria = () => {
    history.push('/admin/categorias/nova');
  };

  const abrirEdicaoCategoria = (id) => {
    history.push(`/admin/categorias/editar/${id}`);
  };

  const deletarCategoria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Não foi possível excluir a categoria.");
      }
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      buscarCategorias();
    } catch (error) {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
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

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="12px">
            <Text fontSize="lg" fontWeight="bold">
              Categorias cadastradas
            </Text>
            <Button colorScheme="brand" onClick={abrirCadastroCategoria}>
              Cadastrar categoria
            </Button>
          </Flex>
          <Table
            variant="simple"
            size="sm"
            style={{ tableLayout: "fixed" }}
            width="100%"
          >
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <Thead>
              <Tr>
                <Th fontSize="md" py="8px">ID</Th>
                <Th fontSize="md" py="8px">Nome</Th>
                <Th fontSize="md" py="8px">Descrição</Th>
                <Th fontSize="md" py="8px">Status</Th>
                <Th fontSize="md" py="8px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categoriasPaginadas && categoriasPaginadas.length > 0 ? (
                categoriasPaginadas.map((categoria) => (
                  <Tr key={categoria.id}>
                    <Td fontSize="md" py="8px">{categoria.id || "-"}</Td>
                    <Td fontSize="md" py="8px">{categoria.nome || "-"}</Td>
                    <Td fontSize="md" py="8px">{categoria.descricao || "-"}</Td>
                    <Td fontSize="md" py="8px">
                      <Badge colorScheme={categoria.ativa ? "green" : "red"}>
                        {categoria.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </Td>
                    <Td fontSize="md" py="8px">
                      <Flex gap="8px">
                        <IconButton
                          icon={<MdEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => abrirEdicaoCategoria(categoria.id)}
                          aria-label="Editar categoria"
                        />
                        <IconButton
                          icon={<MdDelete />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => deletarCategoria(categoria.id)}
                          aria-label="Excluir categoria"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} fontSize="md" py="8px">
                    <Text textAlign="center" color="gray.500">
                      Nenhuma categoria cadastrada até o momento.
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

export default Categorias;

