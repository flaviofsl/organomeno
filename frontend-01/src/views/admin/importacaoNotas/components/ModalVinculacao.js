import React from "react";
import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalOverlay,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default function ModalVinculacao(props) {
  const [showModal, setShowModal] = useState(true)
  const [formData, setFormData ] = useState({
    descricao: '',
    valorBruto: '',
    valorLiquido: '',
    vencimento: null,
    dataCadastro: new Date()
  })
  const handleUpload = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Modal isOpen={showModal} onClose={handleCloseModal} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>PDF Enviado com Sucesso</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Seu arquivo PDF foi enviado com sucesso. <br/>
          Deseja vincular a uma despesa?
          <FormControl mt={4}>
            <FormLabel>Nova Despesa</FormLabel>
            <Input
              type="text"
              placeholder="Descrição/Nome"
              name="descricao"
              value={formData.descricao}
            />
            <Input
              type="number"
              placeholder="Valor Bruto"
              name="valorBruto"
              value={formData.valorBruto}
            />
            
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button colorScheme="blue" mr={3}>
            Aplicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}