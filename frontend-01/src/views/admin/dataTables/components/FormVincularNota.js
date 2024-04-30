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
    const [despesa, setDespesa] = useState({});
    const [notaFiscal, setNotaFiscal] = useState({});

    const handleDespesaChange = (event) => {
        const selectedDespesa = despesas.find((despesa) => despesa.id === parseInt(event.target.value));
        setDespesa(selectedDespesa);
    };

    const handleNotaFiscalChange = (event) => {
        const selectedNotaFiscal = notasFiscais.find((notaFiscal) => notaFiscal.id === parseInt(event.target.value));
        setNotaFiscal(selectedNotaFiscal);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/despesas/vincular-nota", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ despesasDTO: { ...despesa, notaFiscal } }),
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
