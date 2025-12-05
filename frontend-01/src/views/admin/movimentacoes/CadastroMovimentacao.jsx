import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useHistory, useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const initialMovimentacaoForm = {
  idConta: "",
  idReceita: "",
  idDespesa: "",
  dataMovimentacao: new Date().toISOString().split('T')[0],
  valor: "",
  descricao: "",
  tipoMovimentacao: "ENTRADA",
};

const CadastroMovimentacao = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;
  const [movimentacaoForm, setMovimentacaoForm] = useState(initialMovimentacaoForm);
  const [savingMovimentacao, setSavingMovimentacao] = useState(false);
  const [loadingMovimentacao, setLoadingMovimentacao] = useState(false);
  const [contas, setContas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ title: "", description: "", type: "success" });

  // Carregar contas
  const carregarContas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contas`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as contas.");
      }
      const data = await response.json();
      setContas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    }
  }, []);

  // Carregar receitas
  const carregarReceitas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/receitas/todos`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as receitas.");
      }
      const data = await response.json();
      setReceitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    }
  }, []);

  // Carregar despesas
  const carregarDespesas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/todos`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as despesas.");
      }
      const data = await response.json();
      setDespesas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    }
  }, []);

  useEffect(() => {
    carregarContas();
    carregarReceitas();
    carregarDespesas();
  }, [carregarContas, carregarReceitas, carregarDespesas]);

  const carregarMovimentacao = useCallback(async () => {
    setLoadingMovimentacao(true);
    try {
      const response = await fetch(`${API_BASE_URL}/movimentacoes/${id}`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados da movimentação.");
      }
      const data = await response.json();
      const dataMovimentacao = data.dataMovimentacao
        ? new Date(data.dataMovimentacao).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      setMovimentacaoForm({
        idConta: data.idConta || "",
        idReceita: data.idReceita || "",
        idDespesa: data.idDespesa || "",
        dataMovimentacao: dataMovimentacao,
        valor: data.valor || "",
        descricao: data.descricao || "",
        tipoMovimentacao: data.tipoMovimentacao || "ENTRADA",
      });
    } catch (error) {
      setModalMessage({
        title: "Erro ao carregar movimentação",
        description: error.message,
        type: "error",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/movimentacoes');
      }, 3000);
    } finally {
      setLoadingMovimentacao(false);
    }
  }, [id, history, onOpenModal, onCloseModal]);

  // Carregar dados da movimentação se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      carregarMovimentacao();
    }
  }, [isEditMode, id, carregarMovimentacao]);

  const handleMovimentacaoChange = (event) => {
    const { name, value } = event.target;
    setMovimentacaoForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const salvarMovimentacao = async (event) => {
    setSavingMovimentacao(true);
    console.log("salvando movimentação");
    try {
      let url = isEditMode 
        ? `${API_BASE_URL}/movimentacoes/${id}`
        : `${API_BASE_URL}/movimentacoes/`;
      
      let method = isEditMode ? "PUT" : "POST";
      
      // Preparar o body com os dados formatados
      const bodyData = {
        idConta: movimentacaoForm.idConta ? parseInt(movimentacaoForm.idConta) : null,
        idReceita: movimentacaoForm.idReceita ? parseInt(movimentacaoForm.idReceita) : null,
        idDespesa: movimentacaoForm.idDespesa ? parseInt(movimentacaoForm.idDespesa) : null,
        dataMovimentacao: movimentacaoForm.dataMovimentacao,
        valor: movimentacaoForm.valor ? movimentacaoForm.valor.toString() : "",
        descricao: movimentacaoForm.descricao || "",
        tipoMovimentacao: movimentacaoForm.tipoMovimentacao || "ENTRADA",
      };
      
      let response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      console.log(response);
      console.log(response.ok);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Não foi possível ${isEditMode ? 'atualizar' : 'salvar'} a movimentação.`);
      }

      await response.json();
      console.log(response); 
      setModalMessage({
        title: isEditMode ? "Movimentação atualizada" : "Movimentação cadastrada",
        description: `A movimentação foi ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso.`,
        type: "success",
      });
      onOpenModal();
      console.log("redirecionando para a lista de movimentações");
      // Aguardar um pouco antes de redirecionar para evitar conflitos com o modal
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/movimentacoes');
      }, 2000);
    } catch (error) {
      setModalMessage({
        title: "Erro ao salvar",
        description: error.message,
        type: "error",
      });
      onOpenModal();
    } finally {
      setSavingMovimentacao(false);
    }
  };

  const cancelar = () => {
    history.push('/admin/movimentacoes');
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="24px">
            <Text fontSize="xl" fontWeight="bold">
              {isEditMode ? "Editar lançamento de movimentação" : "Cadastro de lançamento de movimentação"}
            </Text>
          </Flex>
          {loadingMovimentacao && (
            <Text mb="4" color="gray.500">
              Carregando dados da movimentação...
            </Text>
          )}
          <form method="post">
            <input type="hidden" name="method" value={isEditMode ? "PUT" : "POST"} />
            <input type="hidden" name="url" value={isEditMode ? `${API_BASE_URL}/movimentacoes/${id}` : `${API_BASE_URL}/movimentacoes/`} />
            <input type="hidden" name="body" value={JSON.stringify(movimentacaoForm)} />
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Conta</FormLabel>
                <Select
                  name="idConta"
                  value={movimentacaoForm.idConta}
                  onChange={handleMovimentacaoChange}
                  placeholder="Selecione uma conta"
                  color="white"
                >
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome} - {conta.banco}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Receita (opcional)</FormLabel>
                  <Select
                    name="idReceita"
                    value={movimentacaoForm.idReceita}
                    onChange={handleMovimentacaoChange}
                    placeholder="Selecione uma receita"
                    color="white"
                  >
                    <option value="">Nenhuma</option>
                    {receitas.map((receita) => (
                      <option key={receita.id} value={receita.id}>
                        {receita.descricao || `Receita #${receita.id}`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Despesa (opcional)</FormLabel>
                  <Select
                    name="idDespesa"
                    value={movimentacaoForm.idDespesa}
                    onChange={handleMovimentacaoChange}
                    placeholder="Selecione uma despesa"
                    color="white"
                  >
                    <option value="">Nenhuma</option>
                    {despesas.map((despesa) => (
                      <option key={despesa.id} value={despesa.id}>
                        {despesa.descricao || `Despesa #${despesa.id}`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tipo de movimentação</FormLabel>
                  <Select
                    name="tipoMovimentacao"
                    value={movimentacaoForm.tipoMovimentacao}
                    onChange={handleMovimentacaoChange}
                    color="white"
                  >
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saída</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Data da movimentação</FormLabel>
                  <Input
                    type="date"
                    name="dataMovimentacao"
                    value={movimentacaoForm.dataMovimentacao}
                    onChange={handleMovimentacaoChange}
                    color="white"
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Valor</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  name="valor"
                  value={movimentacaoForm.valor}
                  onChange={handleMovimentacaoChange}
                  placeholder="0.00"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Input
                  name="descricao"
                  value={movimentacaoForm.descricao}
                  onChange={handleMovimentacaoChange}
                  placeholder="Descrição adicional da movimentação"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <Flex justify="flex-end" gap="12px" mt="24px">
                <Button onClick={cancelar}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" type="button" onClick={salvarMovimentacao} isLoading={savingMovimentacao} isDisabled={loadingMovimentacao}>
                  {isEditMode ? "Atualizar movimentação" : "Salvar movimentação"}
                </Button>
              </Flex>
            </Stack>
          </form>
        </Card>
      </SimpleGrid>

      {/* Modal para exibir mensagens de sucesso ou erro */}
      <Modal isOpen={isOpenModal} onClose={onCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={modalMessage.type === "success" ? "green.500" : "red.500"}>
            {modalMessage.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalMessage.description}</Text>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme={modalMessage.type === "success" ? "green" : "red"} 
              onClick={onCloseModal}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CadastroMovimentacao;

