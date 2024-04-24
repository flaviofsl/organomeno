import {
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import { React, useState } from "react";

import { MdUpload } from "react-icons/md";
import Dropzone from "views/admin/profile/components/Dropzone";

export default function UploadNotas(props) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { used, total, ...rest } = props;

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor, selecione um arquivo.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("htmlFile", file); // Aqui está a modificação

        try {
            const response = await fetch("http://localhost:8080/api/notas", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Nota Fiscal enviada com sucesso!");
                setFile(null);
            } else {
                alert(
                    "Houve um problema ao enviar a Nota Fiscal. Por favor, tente novamente."
                );
            }
        } catch (error) {
            console.error("Erro ao enviar a Nota Fiscal:", error);
            alert("Houve um erro ao enviar a Nota Fiscal.");
        } finally {
            setLoading(false);
        }
    };


    const brandColor = useColorModeValue("brand.500", "white");
    const textColorSecondary = "gray.400";

    return (
        <Card {...rest} mb="20px" align="center" p="20px" w="100%">
            <Flex
                h="100%"
                direction={{ base: "column", "2xl": "row" }}
                justifyContent="center"
                alignItems="center"
            >
                <Dropzone
                    w={{ base: "100%", "2xl": "268px" }}
                    maxH={{ base: "60%", lg: "50%", "2xl": "100%" }}
                    minH={{ base: "60%", lg: "50%", "2xl": "100%" }}
                    onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
                    content={
                        <Flex
                            direction="column"
                            justify="center"
                            alignItems="center"
                            h="100%"
                        >
                            <Icon as={MdUpload} w="80px" h="80px" color={brandColor} />
                            <Text fontSize="xl" fontWeight="700" color={brandColor} mt="12px">
                                {file ? file.name : "Upload"}
                            </Text>
                        </Flex>
                    }
                />
                <Flex direction="column" justifyContent="center">
                    <Text
                        color={textColorSecondary}
                        fontSize="md"
                        my={{ base: "auto", "2xl": "10px" }}
                        mx="auto"
                        textAlign="center"
                    >
                        Insira a Nota Fiscal
                    </Text>
                    <Flex w="100%" justifyContent="center">
                        <Button
                            mb="50px"
                            w="140px"
                            minW="140px"
                            mt={{ base: "20px", "2xl": "auto" }}
                            variant="brand"
                            fontWeight="500"
                            onClick={handleUpload}
                            isLoading={loading}
                        >
                            {loading ? "Enviando..." : "Upload"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
}
