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
  const [pessoas, setPessoas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [pessoaForm, setPessoaForm] = useState(initialPessoaForm);
  const [dependenciaForm, setDependenciaForm] = useState(initialDependenciaForm);
  const [savingPessoa, setSavingPessoa] = useState(false);
  const [savingDependencia, setSavingDependencia] = useState(false);

  const dependentesDisponiveis = useMemo(() => {
    if (!dependenciaForm.responsavelId) {
      return pessoas;
    }
    const responsavelId = Number(dependenciaForm.responsavelId);
    return pessoas.filter((pessoa) => pessoa.id !== responsavelId);
  }, [dependenciaForm.responsavelId, pessoas]);

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
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px">
        <Card p="24px">
          <Text fontSize="lg" fontWeight="bold" mb="12px">
            Cadastro de pessoas
          </Text>
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
              <Flex justify="flex-end">
                <Button
                  colorScheme="brand"
                  type="submit"
                  isLoading={savingPessoa}
                >
                  Salvar pessoa
                </Button>
              </Flex>
            </Stack>
          </form>
        </Card>

        <Card p="24px">
          <Text fontSize="lg" fontWeight="bold" mb="12px">
            Vínculo de dependências
          </Text>
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
                  {pessoas.map((pessoa) => (
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
                  {dependentesDisponiveis.map((pessoa) => (
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
              <Flex justify="flex-end">
                <Button
                  colorScheme="brand"
                  type="submit"
                  isLoading={savingDependencia}
                >
                  Salvar vínculo
                </Button>
              </Flex>
            </Stack>
          </form>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px" mt="20px">
        <Card p="24px" overflowX="auto">
          <Text fontSize="lg" fontWeight="bold" mb="12px">
            Pessoas cadastradas
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>Documento</Th>
                <Th>Data de nascimento</Th>
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
                </Tr>
              ))}
              {!pessoas.length && (
                <Tr>
                  <Td colSpan={4}>
                    <Text textAlign="center" color="gray.500">
                      Nenhuma pessoa cadastrada até o momento.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>

        <Card p="24px" overflowX="auto">
          <Text fontSize="lg" fontWeight="bold" mb="12px">
            Dependências cadastradas
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Responsável</Th>
                <Th>Dependente</Th>
                <Th isNumeric>Nível</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dependencias.map((dependencia) => (
                <Tr key={dependencia.id}>
                  <Td>{dependencia.responsavelNome}</Td>
                  <Td>{dependencia.dependenteNome}</Td>
                  <Td isNumeric>{dependencia.nivel}</Td>
                </Tr>
              ))}
              {!dependencias.length && (
                <Tr>
                  <Td colSpan={3}>
                    <Text textAlign="center" color="gray.500">
                      Nenhuma dependência cadastrada até o momento.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Pessoas;

