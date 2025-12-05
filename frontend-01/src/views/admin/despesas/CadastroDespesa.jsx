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

const initialDespesaForm = {
  categoria: "",
  descricao: "",
  valorBruto: "",
  dataCadastro: new Date().toISOString().split('T')[0],
  fitId: "",
};

const CadastroDespesa = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;
  const [despesaForm, setDespesaForm] = useState(initialDespesaForm);
  const [savingDespesa, setSavingDespesa] = useState(false);
  const [loadingDespesa, setLoadingDespesa] = useState(false);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ title: "", description: "", type: "success" });

  const carregarDespesa = useCallback(async () => {
    setLoadingDespesa(true);
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/${id}`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados da despesa.");
      }
      const data = await response.json();
      const dataCadastro = data.dataCadastro 
        ? new Date(data.dataCadastro).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      setDespesaForm({
        categoria: data.categoria || "",
        descricao: data.descricao || "",
        valorBruto: data.valorBruto || "",
        dataCadastro: dataCadastro,
        fitId: data.fitId || "",
      });
    } catch (error) {
      setModalMessage({
        title: "Erro ao carregar despesa",
        description: error.message,
        type: "error",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/despesas');
      }, 3000);
    } finally {
      setLoadingDespesa(false);
    }
  }, [id, history, onOpenModal, onCloseModal]);

  // Carregar dados da despesa se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      carregarDespesa();
    }
  }, [isEditMode, id, carregarDespesa]);

  const handleDespesaChange = (event) => {
    const { name, value } = event.target;
    setDespesaForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const salvarDespesa = async (event) => {
    setSavingDespesa(true);
    console.log("salvando despesa");
    try {
      let url = isEditMode 
        ? `${API_BASE_URL}/despesas/${id}`
        : `${API_BASE_URL}/despesas/`;
      
      let method = isEditMode ? "PUT" : "POST";
      
      // Preparar o body com os dados formatados
      const bodyData = {
        ...despesaForm,
        valorBruto: despesaForm.valorBruto ? parseFloat(despesaForm.valorBruto) : null,
        dataCadastro: despesaForm.dataCadastro ? new Date(despesaForm.dataCadastro).toISOString() : new Date().toISOString(),
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
        throw new Error(message || `Não foi possível ${isEditMode ? 'atualizar' : 'salvar'} a despesa.`);
      }

      await response.json();
      console.log(response); 
      setModalMessage({
        title: isEditMode ? "Despesa atualizada" : "Despesa cadastrada",
        description: `A despesa foi ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso.`,
        type: "success",
      });
      onOpenModal();
      console.log("redirecionando para a lista de despesas");
      // Aguardar um pouco antes de redirecionar para evitar conflitos com o modal
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/despesas');
      }, 2000);
    } catch (error) {
      setModalMessage({
        title: "Erro ao salvar",
        description: error.message,
        type: "error",
      });
      onOpenModal();
    } finally {
      setSavingDespesa(false);
    }
  };

  const cancelar = () => {
    history.push('/admin/despesas');
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="24px">
            <Text fontSize="xl" fontWeight="bold">
              {isEditMode ? "Editar lançamento de despesa" : "Cadastro de lançamento de despesa"}
            </Text>
          </Flex>
          {loadingDespesa && (
            <Text mb="4" color="gray.500">
              Carregando dados da despesa...
            </Text>
          )}
          <form method="post">
            <input type="hidden" name="method" value={isEditMode ? "PUT" : "POST"} />
            <input type="hidden" name="url" value={isEditMode ? `${API_BASE_URL}/despesas/${id}` : `${API_BASE_URL}/despesas/`} />
            <input type="hidden" name="body" value={JSON.stringify(despesaForm)} />
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Categoria</FormLabel>
                <Input
                  name="categoria"
                  value={despesaForm.categoria}
                  onChange={handleDespesaChange}
                  placeholder="Ex: Alimentação, Transporte, Saúde"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  name="descricao"
                  value={despesaForm.descricao}
                  onChange={handleDespesaChange}
                  placeholder="Ex: Compra no supermercado"
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
                    value={despesaForm.valorBruto}
                    onChange={handleDespesaChange}
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
                    value={despesaForm.dataCadastro}
                    onChange={handleDespesaChange}
                    color="white"
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Fit ID (opcional)</FormLabel>
                <Input
                  name="fitId"
                  value={despesaForm.fitId}
                  onChange={handleDespesaChange}
                  placeholder="ID da transação"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <Flex justify="flex-end" gap="12px" mt="24px">
                <Button onClick={cancelar}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" type="button" onClick={salvarDespesa} isLoading={savingDespesa} isDisabled={loadingDespesa}>
                  {isEditMode ? "Atualizar despesa" : "Salvar despesa"}
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

export default CadastroDespesa;

