import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import { FaEye } from "react-icons/fa";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{
            base: "flex",
          }}
          icon={<FaEye />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            isCentered
            className="flex justify-center flex-col items-center"
          >
            <Image
              className="rounded-full w-[200px] h-[200px] "
              src={user?.profilePic}
              alt="Profile Picture"
            />
            <Text className="text-center mt-[15px] text-[30px] ">
              Email: {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ProfileModal.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};
export default ProfileModal;
