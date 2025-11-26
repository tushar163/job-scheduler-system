import { Modal, ModalBody, ModalContent,} from "@heroui/react";
import React from "react";

const FormModal = ({
  children,
  isOpen,
  setIsOpen,
  onRowSelected,
  setMethod,
}) => {
  const onClose = () => {
    setIsOpen(false);
    onRowSelected(null);
    setMethod("Create");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement={"auto"}
        scrollBehavior={"inside"}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-5 h-full">
                {children}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormModal;
