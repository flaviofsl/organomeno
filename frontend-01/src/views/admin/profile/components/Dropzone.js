// Chakra imports
import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
// Assets
import React, { useCallback } from "react"; // Importe useCallback
import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const { content, ...rest } = props;

  // Adicione a função de callback para lidar com a seleção de arquivos
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        rest.onDrop(acceptedFiles); // Chame a função onDrop passada como propriedade
      }
    },
    [rest]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      w="100%"
      h="max-content"
      minH="100%"
      cursor="pointer"
      {...getRootProps({ className: "dropzone" })}
      {...rest}
    >
      <Input type="file" variant="unstyled" {...getInputProps()} />
      <Button variant="no-effects">{content}</Button>
    </Flex>
  );
}

export default Dropzone;
