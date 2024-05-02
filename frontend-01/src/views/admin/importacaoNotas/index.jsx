import { Box, Grid } from "@chakra-ui/react";
import UploadNotas from "./components/UploadNotas";
import UploadOfx from "./components/UploadOfx";

export default function ImportacaoNotas() {
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Grid
                h="100%"
                w="100%"
                templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                gap={8}
            >
                <UploadNotas
                    minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
                    pe={{ base: "20px" }}
                    pb={{ base: "100px", lg: "20px" }}
                    w="100%"                                        
                />
                <UploadOfx/>
            </Grid>
        </Box>
    );
}
