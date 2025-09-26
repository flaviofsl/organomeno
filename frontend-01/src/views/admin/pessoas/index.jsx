import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import Card from "components/card/Card";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const initialPessoaForm = {
  nome: "",
  dataNascimento: "",
  tipo: "FISICA",
  cpf: "",
  rg: "",
  sexo: "",
  irpf: "",
  cnpj: "",
  ie: "",
  irpj: "",
};

const initialDependenciaForm = {
  responsavelId: "",
  dependenteId: "",
  nivel: 1,
};

const Pessoas = () => {
  const toast = useToast();
  const { isOpen: isOpenView, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenAddPessoa, onOpen: onOpenAddPessoa, onClose: onCloseAddPessoa } = useDisclosure();
  const [pessoas, setPessoas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [pessoaForm, setPessoaForm] = useState(initialPessoaForm);
  const [dependenciaForm, setDependenciaForm] = useState(initialDependenciaForm);
  const [savingPessoa, setSavingPessoa] = useState(false);
  const [savingDependencia, setSavingDependencia] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  const dependentesDisponiveis = useMemo(() => {
    if (!dependenciaForm.responsavelId) {
      return pessoas;
    }
    const responsavelId = Number(dependenciaForm.responsavelId);
    return pessoas.filter((pessoa) => pessoa.id !== responsavelId);
  }, [dependenciaForm.responsavelId, pessoas]);

  const dependenciasDaPessoa = useMemo(() => {
    if (!pessoaSelecionada) return [];
    return dependencias.filter(
      (dep) => dep.responsavelId === pessoaSelecionada.id || dep.dependenteId === pessoaSelecionada.id
    );
  }, [pessoaSelecionada, dependencias]);

  const buscarPessoas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pessoas`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar as pessoas cadastradas.");
      }
      const data = await response.json();
      setPessoas(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar pessoas",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [toast]);

  const buscarDependencias = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pessoas/dependencias`);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os vínculos cadastrados.");
      }
      const data = await response.json();
      setDependencias(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar dependências",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    buscarPessoas();
    buscarDependencias();
  }, [buscarPessoas, buscarDependencias]);

  const handlePessoaChange = (event) => {
    const { name, value } = event.target;
    setPessoaForm((current) => ({ ...current, [name]: value }));
  };

  const handleDependenciaChange = (event) => {
    const { name, value } = event.target;
    setDependenciaForm((current) => ({ ...current, [name]: value }));
  };

  const abrirModalDependencias = (pessoa) => {
    setPessoaSelecionada(pessoa);
    onOpenView();
  };

  const abrirModalAdicionarDependencia = (pessoa) => {
    setPessoaSelecionada(pessoa);
    onOpenAdd();
  };

  const salvarPessoa = async (event) => {
    event.preventDefault();
    setSavingPessoa(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pessoas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pessoaForm),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Não foi possível salvar a pessoa.");
      }

      await response.json();
      toast({
        title: "Pessoa cadastrada",
        description: "A pessoa foi cadastrada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setPessoaForm(initialPessoaForm);
      await buscarPessoas();
        onCloseAddPessoa();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSavingPessoa(false);
    }
  };

  const salvarDependencia = async (event) => {
    event.preventDefault();
    setSavingDependencia(true);
    try {
      const payload = {
        ...dependenciaForm,
        responsavelId: dependenciaForm.responsavelId
          ? Number(dependenciaForm.responsavelId)
          : null,
        dependenteId: dependenciaForm.dependenteId
          ? Number(dependenciaForm.dependenteId)
          : null,
        nivel: dependenciaForm.nivel ? Number(dependenciaForm.nivel) : null,
      };

      const response = await fetch(`${API_BASE_URL}/pessoas/dependencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Não foi possível salvar o vínculo.");
      }

      await response.json();
      toast({
        title: "Vínculo criado",
        description: "Dependência registrada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setDependenciaForm(initialDependenciaForm);
      await buscarDependencias();
      onCloseAdd();
    } catch (error) {
      toast({
        title: "Erro ao salvar vínculo",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSavingDependencia(false);
    }
  };

  return (
    <Box pt="80px">
      <SimpleGrid columns={1} gap="20px">
      <Card w="100%" p="24px" overflowX="auto">
          <Flex align="center" justify="space-between" mb="12px">
            <Text fontSize="lg" fontWeight="bold">
              Pessoas cadastradas
            </Text>
            <Button colorScheme="brand" onClick={onOpenAddPessoa}>
              Cadastrar pessoa
            </Button>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>Documento</Th>
                <Th>Data de nascimento</Th>
                <Th>Ver</Th>
                <Th>Adicionar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pessoas.map((pessoa) => (
                <Tr key={pessoa.id}>
                  <Td>{pessoa.nome}</Td>
                  <Td>{pessoa.tipo === "JURIDICA" ? "Jurídica" : "Física"}</Td>
                  <Td>
                    {pessoa.tipo === "JURIDICA"
                      ? pessoa.cnpj || "-"
                      : pessoa.cpf || "-"}
                  </Td>
                  <Td>{pessoa.dataNascimento ? pessoa.dataNascimento : "-"}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                      onClick={() => abrirModalDependencias(pessoa)}
                    >
                      Ver dependências
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                      onClick={() => abrirModalAdicionarDependencia(pessoa)}
                    >
                      Adicionar dependência
                    </Button>
                  </Td>
                </Tr>
              ))}
              {!pessoas.length && (
                <Tr>
                  <Td colSpan={6}>
                    <Text textAlign="center" color="gray.500">
                      Nenhuma pessoa cadastrada até o momento.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </SimpleGrid>

      {/* Modal para exibir dependências */}
      <Modal isOpen={isOpenView} onClose={onCloseView} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Dependências de {pessoaSelecionada?.nome}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dependenciasDaPessoa.length > 0 ? (
              <Stack spacing={4}>
                {dependenciasDaPessoa.map((dep) => {
                  const responsavel = pessoas.find(p => p.id === dep.responsavelId);
                  const dependente = pessoas.find(p => p.id === dep.dependenteId);
                  
                  return (
                    <Box key={dep.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="bold">
                            {dep.responsavelId === pessoaSelecionada?.id ? "Responsável por:" : "Dependente de:"}
                          </Text>
                          <Text>
                            {dep.responsavelId === pessoaSelecionada?.id 
                              ? dependente?.nome 
                              : responsavel?.nome}
                          </Text>
                        </Box>
                        <Badge colorScheme="blue" fontSize="sm">
                          Nível {dep.nivel}
                        </Badge>
                      </Flex>
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Text textAlign="center" color="gray.500" py={8}>
                Esta pessoa não possui dependências cadastradas.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseView}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para cadastrar pessoa */}
      <Modal isOpen={isOpenAddPessoa} onClose={onCloseAddPessoa} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro de pessoa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={salvarPessoa}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    name="nome"
                    value={pessoaForm.nome}
                    onChange={handlePessoaChange}
                    placeholder="Nome completo"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Data de nascimento</FormLabel>
                  <Input
                    type="date"
                    name="dataNascimento"
                    value={pessoaForm.dataNascimento}
                    onChange={handlePessoaChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    name="tipo"
                    value={pessoaForm.tipo}
                    onChange={handlePessoaChange}
                  >
                    <option value="FISICA">Pessoa física</option>
                    <option value="JURIDICA">Pessoa jurídica</option>
                  </Select>
                </FormControl>
                {pessoaForm.tipo === "FISICA" ? (
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>CPF</FormLabel>
                      <Input
                        name="cpf"
                        value={pessoaForm.cpf}
                        onChange={handlePessoaChange}
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>RG</FormLabel>
                      <Input
                        name="rg"
                        value={pessoaForm.rg}
                        onChange={handlePessoaChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Sexo</FormLabel>
                      <Input
                        name="sexo"
                        value={pessoaForm.sexo}
                        onChange={handlePessoaChange}
                        placeholder="Feminino, Masculino, Outro"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>IRPF</FormLabel>
                      <Input
                        name="irpf"
                        value={pessoaForm.irpf}
                        onChange={handlePessoaChange}
                        placeholder="Situação da declaração de IRPF"
                      />
                    </FormControl>
                  </Stack>
                ) : (
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>CNPJ</FormLabel>
                      <Input
                        name="cnpj"
                        value={pessoaForm.cnpj}
                        onChange={handlePessoaChange}
                        placeholder="00.000.000/0000-00"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Inscrição estadual</FormLabel>
                      <Input
                        name="ie"
                        value={pessoaForm.ie}
                        onChange={handlePessoaChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>IRPJ</FormLabel>
                      <Input
                        name="irpj"
                        value={pessoaForm.irpj}
                        onChange={handlePessoaChange}
                        placeholder="Situação da declaração de IRPJ"
                      />
                    </FormControl>
                  </Stack>
                )}
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onCloseAddPessoa}>
              Cancelar
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={savingPessoa} onClick={salvarPessoa}>
              Salvar pessoa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal para adicionar dependência */}
      <Modal isOpen={isOpenAdd} onClose={onCloseAdd} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Adicionar dependência para {pessoaSelecionada?.nome}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={salvarDependencia}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Responsável</FormLabel>
                  <Select
                    placeholder="Selecione"
                    name="responsavelId"
                    value={dependenciaForm.responsavelId}
                    onChange={handleDependenciaChange}
                  >
                    <option value={pessoaSelecionada?.id}>
                      {pessoaSelecionada?.nome} (pessoa selecionada)
                    </option>
                    {pessoas.filter(p => p.id !== pessoaSelecionada?.id).map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dependente</FormLabel>
                  <Select
                    placeholder="Selecione"
                    name="dependenteId"
                    value={dependenciaForm.dependenteId}
                    onChange={handleDependenciaChange}
                    isDisabled={!pessoas.length}
                  >
                    {pessoas.filter(p => p.id !== dependenciaForm.responsavelId).map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Nível</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    name="nivel"
                    value={dependenciaForm.nivel}
                    onChange={handleDependenciaChange}
                  />
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onCloseAdd}>
              Cancelar
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={savingDependencia}
              onClick={salvarDependencia}
            >
              Salvar vínculo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Pessoas;

