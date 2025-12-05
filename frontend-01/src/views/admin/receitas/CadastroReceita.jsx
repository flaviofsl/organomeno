import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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

const initialReceitaForm = {
  descricao: "",
  valorBruto: "",
  dataCadastro: new Date().toISOString().split('T')[0],
  fitId: "",
};

const CadastroReceita = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;
  const [receitaForm, setReceitaForm] = useState(initialReceitaForm);
  const [savingReceita, setSavingReceita] = useState(false);
  const [loadingReceita, setLoadingReceita] = useState(false);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ title: "", description: "", type: "success" });

  const carregarReceita = useCallback(async () => {
    setLoadingReceita(true);
    try {
      const response = await fetch(`${API_BASE_URL}/receitas/${id}`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados da receita.");
      }
      const data = await response.json();
      const dataCadastro = (data.dataEntrada || data.dataCadastro)
        ? new Date(data.dataEntrada || data.dataCadastro).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      setReceitaForm({
        descricao: data.descricao || "",
        valorBruto: data.valorBruto || "",
        dataCadastro: dataCadastro,
        fitId: data.fitId || "",
      });
    } catch (error) {
      setModalMessage({
        title: "Erro ao carregar receita",
        description: error.message,
        type: "error",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/receitas');
      }, 3000);
    } finally {
      setLoadingReceita(false);
    }
  }, [id, history, onOpenModal, onCloseModal]);

  // Carregar dados da receita se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      carregarReceita();
    }
  }, [isEditMode, id, carregarReceita]);

  const handleReceitaChange = (event) => {
    const { name, value } = event.target;
    setReceitaForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const salvarReceita = async (event) => {
    setSavingReceita(true);
    console.log("salvando receita");
    try {
      let url = isEditMode 
        ? `${API_BASE_URL}/receitas/${id}`
        : `${API_BASE_URL}/receitas/`;
      
      let method = isEditMode ? "PUT" : "POST";
      
      // Preparar o body com os dados formatados
      const bodyData = {
        ...receitaForm,
        valorBruto: receitaForm.valorBruto ? parseFloat(receitaForm.valorBruto) : null,
        dataEntrada: receitaForm.dataCadastro ? new Date(receitaForm.dataCadastro).toISOString() : new Date().toISOString(),
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
        throw new Error(message || `Não foi possível ${isEditMode ? 'atualizar' : 'salvar'} a receita.`);
      }

      await response.json();
      console.log(response); 
      setModalMessage({
        title: isEditMode ? "Receita atualizada" : "Receita cadastrada",
        description: `A receita foi ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso.`,
        type: "success",
      });
      onOpenModal();
      console.log("redirecionando para a lista de receitas");
      // Aguardar um pouco antes de redirecionar para evitar conflitos com o modal
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/receitas');
      }, 2000);
    } catch (error) {
      setModalMessage({
        title: "Erro ao salvar",
        description: error.message,
        type: "error",
      });
      onOpenModal();
    } finally {
      setSavingReceita(false);
    }
  };

  const cancelar = () => {
    history.push('/admin/receitas');
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="24px">
            <Text fontSize="xl" fontWeight="bold">
              {isEditMode ? "Editar lançamento de receita" : "Cadastro de lançamento de receita"}
            </Text>
          </Flex>
          {loadingReceita && (
            <Text mb="4" color="gray.500">
              Carregando dados da receita...
            </Text>
          )}
          <form method="post">
            <input type="hidden" name="method" value={isEditMode ? "PUT" : "POST"} />
            <input type="hidden" name="url" value={isEditMode ? `${API_BASE_URL}/receitas/${id}` : `${API_BASE_URL}/receitas/`} />
            <input type="hidden" name="body" value={JSON.stringify(receitaForm)} />
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  name="descricao"
                  value={receitaForm.descricao}
                  onChange={handleReceitaChange}
                  placeholder="Ex: Venda de produtos, Salário, Aluguel recebido"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Valor</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    name="valorBruto"
                    value={receitaForm.valorBruto}
                    onChange={handleReceitaChange}
                    placeholder="0.00"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Data de cadastro</FormLabel>
                  <Input
                    type="date"
                    name="dataCadastro"
                    value={receitaForm.dataCadastro}
                    onChange={handleReceitaChange}
                    color="white"
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Fit ID (opcional)</FormLabel>
                <Input
                  name="fitId"
                  value={receitaForm.fitId}
                  onChange={handleReceitaChange}
                  placeholder="ID da transação"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <Flex justify="flex-end" gap="12px" mt="24px">
                <Button onClick={cancelar}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" type="button" onClick={salvarReceita} isLoading={savingReceita} isDisabled={loadingReceita}>
                  {isEditMode ? "Atualizar receita" : "Salvar receita"}
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

export default CadastroReceita;

