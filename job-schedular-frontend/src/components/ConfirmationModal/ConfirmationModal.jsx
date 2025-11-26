import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

function ConfirmationModal({
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  onDeleteConfirm,
  setMethod,
  onRowSelected,
}) {
  const onClose = () => {
    onRowSelected(null);
    setMethod("Create");
    setIsConfirmModalOpen((prev) => !prev);
  };

  return (
    <>
      <Modal
        size="xl"
        isOpen={isConfirmModalOpen}
        onClose={onClose}
        hideCloseButton
        className="flex justify-center items-center overflow-hidden"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center items-center text-lg sm:text-2xl">
                {`Delete Record`}
              </ModalHeader>
              <ModalBody className="flex justify-center items-center">
                <p className="font-medium text-lg sm:text-2xl">{`Do you want to delete this record?`}</p>
                <p className="text-sm text-default-600">{`You won't be able to revert this!`}</p>
              </ModalBody>
              <ModalFooter className="flex justify-center items-center gap-6">
                <Button
                  size="lg"
                  radius="sm"
                  className="w-28 sm:w-36 bg-transparent border text-sm hover:border-error text-default-700"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  size="lg"
                  radius="sm"
                  className={`w-28 sm:w-36 bg-danger text-sm text-white`}
                  onPress={() => {
                    onDeleteConfirm({
                      value: true,
                    });
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
