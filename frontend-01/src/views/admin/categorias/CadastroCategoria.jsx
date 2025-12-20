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
  Textarea,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useHistory, useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const initialCategoriaForm = {
  nome: "",
  descricao: "",
  ativa: true,
};

const CadastroCategoria = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEditMode = !!id;
  const [categoriaForm, setCategoriaForm] = useState(initialCategoriaForm);
  const [savingCategoria, setSavingCategoria] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ title: "", description: "", type: "success" });

  const carregarCategoria = useCallback(async () => {
    setLoadingCategoria(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados da categoria.");
      }
      const data = await response.json();
      setCategoriaForm({
        nome: data.nome || "",
        descricao: data.descricao || "",
        ativa: data.ativa !== undefined ? data.ativa : true,
      });
    } catch (error) {
      setModalMessage({
        title: "Erro ao carregar categoria",
        description: error.message,
        type: "error",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/categorias');
      }, 3000);
    } finally {
      setLoadingCategoria(false);
    }
  }, [id, history, onOpenModal, onCloseModal]);

  // Carregar dados da categoria se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      carregarCategoria();
    }
  }, [isEditMode, id, carregarCategoria]);

  const handleCategoriaChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCategoriaForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const salvarCategoria = async (event) => {
    setSavingCategoria(true);
    try {
      let url = isEditMode 
        ? `${API_BASE_URL}/categorias/${id}`
        : `${API_BASE_URL}/categorias/`;
      
      let method = isEditMode ? "PUT" : "POST";
      
      let response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoriaForm),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Não foi possível ${isEditMode ? 'atualizar' : 'salvar'} a categoria.`);
      }

      await response.json();
      setModalMessage({
        title: isEditMode ? "Categoria atualizada" : "Categoria cadastrada",
        description: `A categoria foi ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso.`,
        type: "success",
      });
      onOpenModal();
      setTimeout(() => {
        onCloseModal();
        history.push('/admin/categorias');
      }, 2000);
    } catch (error) {
      setModalMessage({
        title: "Erro ao salvar",
        description: error.message,
        type: "error",
      });
      onOpenModal();
    } finally {
      setSavingCategoria(false);
    }
  };

  const cancelar = () => {
    history.push('/admin/categorias');
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={1} gap="20px">
        <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="24px">
            <Text fontSize="xl" fontWeight="bold">
              {isEditMode ? "Editar categoria" : "Cadastro de categoria"}
            </Text>
          </Flex>
          {loadingCategoria && (
            <Text mb="4" color="gray.500">
              Carregando dados da categoria...
            </Text>
          )}
          <form method="post">
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome da categoria</FormLabel>
                <Input
                  name="nome"
                  value={categoriaForm.nome}
                  onChange={handleCategoriaChange}
                  placeholder="Ex: Alimentação, Transporte, Saúde"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  name="descricao"
                  value={categoriaForm.descricao}
                  onChange={handleCategoriaChange}
                  placeholder="Descreva a categoria (opcional)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  rows={4}
                />
              </FormControl>
              <FormControl>
                <Checkbox
                  name="ativa"
                  isChecked={categoriaForm.ativa}
                  onChange={(e) => setCategoriaForm((current) => ({ ...current, ativa: e.target.checked }))}
                >
                  Categoria ativa
                </Checkbox>
              </FormControl>
              <Flex justify="flex-end" gap="12px" mt="24px">
                <Button onClick={cancelar}>
                  Cancelar
                </Button>
                <Button colorScheme="brand" type="button" onClick={salvarCategoria} isLoading={savingCategoria} isDisabled={loadingCategoria}>
                  {isEditMode ? "Atualizar categoria" : "Salvar categoria"}
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

export default CadastroCategoria;

