import { useState } from "react";
import {
  Select,
  Button,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import Card from "components/card/Card";

export default function FormVincularNota({
  despesas,
  notasFiscais
}) {
  const [despesaId, setDespesaId] = useState("");
  const [notaFiscalId, setNotaFiscalId] = useState("");

  const handleDespesaChange = (event) => {
    setDespesaId(event.target.value);
  };

  const handleNotaFiscalChange = (event) => {
    setNotaFiscalId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const despesaSelecionada = despesas.find((despesa) => despesa.id === parseInt(despesaId));
      const notaFiscalSelecionada = notasFiscais.find((notaFiscal) => notaFiscal.id === parseInt(notaFiscalId));
      
      if (!despesaSelecionada || !notaFiscalSelecionada) {
        console.error("Despesa ou nota fiscal não encontrada.");
        return;
      }

      despesaSelecionada.notaFiscal = notaFiscalSelecionada;
      
      const response = await fetch("http://localhost:8080/api/despesas/vincular-nota", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(despesaSelecionada),
      });
      
      if (response.ok) {
        console.log("Nota fiscal vinculada com sucesso à despesa!");
      } else {
        console.error("Erro ao vincular nota fiscal à despesa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
    }
  };

  return (
    <Card>
      <Box p="6">
        <Text fontSize="xl" fontWeight="bold" mb="4">
          Vincular Despesa e Nota Fiscal
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex mb={4}>
            <Select
              placeholder="Selecione uma despesa"
              value={despesaId}
              onChange={handleDespesaChange}
              mr={2}
            >
              {despesas.map((despesa) => (
                <option key={despesa.id} value={despesa.id}>
                  {despesa.id} - {despesa.descricao}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Selecione uma nota fiscal"
              value={notaFiscalId}
              onChange={handleNotaFiscalChange}
              mr={2}
            >
              {notasFiscais.map((notaFiscal) => (
                <option key={notaFiscal.id} value={notaFiscal.id}>
                  {notaFiscal.descricao}
                </option>
              ))}
            </Select>
            <Button type="submit" ml={2}>
              Vincular
            </Button>
          </Flex>
        </form>
      </Box>
    </Card>
  );
}
