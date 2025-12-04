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
  Checkbox,
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

const initialContaForm = {
  nome: "",
  banco: "",
  agencia: "",
  numeroConta: "",
  tipoConta: "CORRENTE",
  saldoInicial: "",
  ativa: true,
};

const CadastroConta = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;
  const [contaForm, setContaForm] = useState(initialContaForm);
  const [savingConta, setSavingConta] = useState(false);
  const [loadingConta, setLoadingConta] = useState(false);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ title: "", description: "", type: "success" });

  const carregarConta = useCallback(async () => {
    setLoadingConta(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contas/${id}`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados da conta.");
      }
      const data = await response.json();
      setContaForm({
        nome: data.nome || "",
        banco: data.banco || "",
        agencia: data.agencia || "",
        numeroConta: data.numeroConta || "",
        tipoConta: data.tipoConta || "CORRENTE",
        saldoInicial: data.saldoInicial || "",
        ativa: data.ativa !== undefined ? data.ativa : true,
      });
    } catch (error) {
      setModalMessage({
        title: "Erro ao carregar conta",
        description: error.message,
        type: "error",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/contas');
      }, 3000);
    } finally {
      setLoadingConta(false);
    }
  }, [id, history, onOpenModal, onCloseModal]);

  // Carregar dados da conta se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      carregarConta();
    }
  }, [isEditMode, id, carregarConta]);

  const handleContaChange = (event) => {
    const { name, value, type, checked } = event.target;
    setContaForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const salvarConta = async (event) => {
    //event.preventDefault();
    setSavingConta(true);
    console.log("salvando conta");
    try {
      let url = isEditMode 
        ? `${API_BASE_URL}/contas/${id}`
        : `${API_BASE_URL}/contas/`;
      
        let method = isEditMode ? "PUT" : "POST";
      
        let response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contaForm),
      });
      console.log(response);
      console.log(response.ok);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Não foi possível ${isEditMode ? 'atualizar' : 'salvar'} a conta.`);
      }

      await response.json();
      console.log(response); 
      setModalMessage({
        title: isEditMode ? "Conta atualizada" : "Conta cadastrada",
        description: `A conta foi ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso.`,
        type: "success",
      });
      onOpenModal();
      console.log("redirecionando para a lista de contas");
      // Aguardar um pouco antes de redirecionar para evitar conflitos com o modal
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/contas');
      }, 2000);
    } catch (error) {
      setModalMessage({
        title: "Erro ao salvar",
        description: error.message,
        type: "error",
      });
      onOpenModal();
    } finally {
      setSavingConta(false);
    }
  };

  const cancelar = () => {
    history.push('/admin/contas');
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="24px">
            <Text fontSize="xl" fontWeight="bold">
              {isEditMode ? "Editar conta bancária" : "Cadastro de conta bancária"}
            </Text>
          </Flex>
          {loadingConta && (
            <Text mb="4" color="gray.500">
              Carregando dados da conta...
            </Text>
          )}
          <form  method="post">
            <input type="hidden" name="method" value={isEditMode ? "PUT" : "POST"} />
            <input type="hidden" name="url" value={isEditMode ? `${API_BASE_URL}/contas/${id}` : `${API_BASE_URL}/contas/`} />
            <input type="hidden" name="body" value={JSON.stringify(contaForm)} />
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome da conta</FormLabel>
                <Input
                  name="nome"
                  value={contaForm.nome}
                  onChange={handleContaChange}
                  placeholder="Ex: Conta Corrente Principal"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Banco</FormLabel>
                <Input
                  name="banco"
                  value={contaForm.banco}
                  onChange={handleContaChange}
                  placeholder="Ex: Banco do Brasil, Itaú, Bradesco"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Agência</FormLabel>
                  <Input
                    name="agencia"
                    value={contaForm.agencia}
                    onChange={handleContaChange}
                    placeholder="0000"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Número da conta</FormLabel>
                  <Input
                    name="numeroConta"
                    value={contaForm.numeroConta}
                    onChange={handleContaChange}
                    placeholder="00000-0"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Tipo de conta</FormLabel>
                <Select
                  name="tipoConta"
                  value={contaForm.tipoConta}
                  onChange={handleContaChange}
                  color="white"
                >
                  <option value="CORRENTE">Conta Corrente</option>
                  <option value="POUPANCA">Poupança</option>
                  <option value="SALARIO">Conta Salário</option>
                  <option value="INVESTIMENTO">Investimento</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Saldo inicial</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  name="saldoInicial"
                  value={contaForm.saldoInicial}
                  onChange={handleContaChange}
                  placeholder="0.00"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl>
                <Checkbox
                  name="ativa"
                  isChecked={contaForm.ativa}
                  onChange={(e) => setContaForm((current) => ({ ...current, ativa: e.target.checked }))}
                >
                  Conta ativa
                </Checkbox>
              </FormControl>
              <Flex justify="flex-end" gap="12px" mt="24px">
                <Button onClick={cancelar}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" type="button"  onClick={salvarConta} isLoading={savingConta} isDisabled={loadingConta}>
                  {isEditMode ? "Atualizar conta" : "Salvar conta"}
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

export default CadastroConta;

