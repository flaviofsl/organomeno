import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
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
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { MdUpload, MdArrowBack, MdVisibility } from "react-icons/md";
import Dropzone from "views/admin/profile/components/Dropzone";
import CardComponent from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const ImportarOfx = () => {
  const toast = useToast();
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contas, setContas] = useState([]);
  const [idConta, setIdConta] = useState("");
  const [arquivosImportados, setArquivosImportados] = useState([]);
  const [loadingArquivos, setLoadingArquivos] = useState(false);

  const carregarContas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as contas.");
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
    }
  }, [toast]);

  const carregarArquivosImportados = useCallback(async () => {
    setLoadingArquivos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ofx/listar`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os arquivos importados.");
      }
      const data = await response.json();
      setArquivosImportados(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erro ao carregar arquivos",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setArquivosImportados([]);
    } finally {
      setLoadingArquivos(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarContas();
    carregarArquivosImportados();
  }, [carregarContas, carregarArquivosImportados]);

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo OFX para importar.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!idConta) {
      toast({
        title: "Conta não selecionada",
        description: "Por favor, selecione uma conta de destino.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fileUpload", file);
    formData.append("usuario", "123123123");
    formData.append("idConta", idConta);

    try {
      const response = await fetch(`${API_BASE_URL}/ofx/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Arquivo importado com sucesso!",
          description: "O arquivo OFX foi processado e as movimentações foram importadas.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFile(null);
        setIdConta("");
        carregarArquivosImportados();
      } else {
        const errorText = await response.text();
        toast({
          title: "Erro ao importar arquivo",
          description: errorText || "Houve um problema ao processar o arquivo OFX.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo OFX:", error);
      toast({
        title: "Erro ao importar arquivo",
        description: "Houve um erro ao enviar o arquivo OFX. Por favor, tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
        <CardComponent w="100%" p="24px">
          <Flex align="center" justify="space-between" mb="20px">
            <Flex align="center" gap="12px">
              <Button
                leftIcon={<MdArrowBack />}
                variant="ghost"
                onClick={() => history.push('/admin/movimentacoes')}
              >
                Voltar
              </Button>
              <Text fontSize="xl" fontWeight="bold">
                Importar Arquivo OFX
              </Text>
            </Flex>
          </Flex>

          <Divider mb="24px" />

          {/* Seção de Upload */}
          <Box mb="32px">
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Importar Novo Arquivo
            </Text>
            <SimpleGrid columns={1} gap="16px">
              <FormControl isRequired>
                <FormLabel>Conta de Destino</FormLabel>
                <Select
                  value={idConta}
                  onChange={(e) => setIdConta(e.target.value)}
                  placeholder="Selecione uma conta"
                >
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome} - {conta.banco}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <FormLabel mb="8px">Arquivo OFX</FormLabel>
                <Dropzone
                  onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
                  content={
                    <Flex
                      direction="column"
                      justify="center"
                      alignItems="center"
                      h="100%"
                    >
                      <Icon as={MdUpload} w="60px" h="60px" color="brand.500" />
                      <Text fontSize="md" fontWeight="600" color="brand.500" mt="12px">
                        {file ? file.name : "Clique ou arraste o arquivo OFX aqui"}
                      </Text>
                      {file && (
                        <Text fontSize="sm" color="gray.500" mt="4px">
                          {(file.size / 1024).toFixed(2)} KB
                        </Text>
                      )}
                    </Flex>
                  }
                />
              </Box>

              <Button
                colorScheme="brand"
                onClick={handleUpload}
                isLoading={loading}
                loadingText="Importando..."
                isDisabled={!file || !idConta}
              >
                Importar Arquivo
              </Button>
            </SimpleGrid>
          </Box>

          <Divider mb="24px" />

          {/* Seção de Arquivos Importados */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb="16px">
              Arquivos Importados
            </Text>
            {loadingArquivos ? (
              <Text textAlign="center" color="gray.500" py="20px">
                Carregando arquivos...
              </Text>
            ) : arquivosImportados.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Nome do Arquivo</Th>
                    <Th>Conta</Th>
                    <Th>Data de Importação</Th>
                    <Th>Receitas</Th>
                    <Th>Despesas</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {arquivosImportados.map((arquivo) => (
                    <Tr key={arquivo.id}>
                      <Td>{arquivo.nomeArquivo}</Td>
                      <Td>{arquivo.nomeConta}</Td>
                      <Td>{formatarData(arquivo.dataImportacao)}</Td>
                      <Td>
                        <Badge colorScheme="green">
                          {arquivo.quantidadeReceitas || 0}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="red">
                          {arquivo.quantidadeDespesas || 0}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<MdVisibility />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => history.push(`/admin/movimentacoes/arquivo-ofx/${arquivo.id}`)}
                          aria-label="Ver detalhes"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center" color="gray.500" py="20px">
                Nenhum arquivo importado até o momento.
              </Text>
            )}
          </Box>
        </CardComponent>
      </SimpleGrid>
    </Box>
  );
};

export default ImportarOfx;

