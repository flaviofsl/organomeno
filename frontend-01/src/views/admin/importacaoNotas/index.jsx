import { Box, Grid } from "@chakra-ui/react";
import UploadNotas from "./components/UploadNotas";
import ModalVinculacao from "./components/ModalVinculacao";

export default function ImportacaoNotas() {
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Grid templateColumns="1fr">
                <UploadNotas
                    minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
                    pe='20px'
                    pb={{ base: "100px", lg: "20px" }}
                    w="100%"
                    maxW="1000px"
                    mx="auto"
                />
            </Grid>
            <ModalVinculacao
                setShowModal={true}
            />
        </Box>
    );
}
