import {
  Button,
  Center,
  CheckIcon,
  FormControl,
  HStack,
  HamburgerIcon,
  Input,
  Menu,
  Modal,
  Popover,
  Select,
  StatusBar,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { EMatrixCell } from "../components/EMatrixCell";
import { Text } from "native-base";
import { Keyboard, Pressable, TextInput } from "react-native";
import { Priority, Prioritys, matrixColors } from "../utils";
import { NewTaskData, storage } from "../storage";
import { EditTaskModal } from "../components/EditTaskModal";

export const Matrix = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const toggleModal = (initalTaskValue: NewTaskData) => {
    if (!modalVisible) {
      console.log(initalTaskValue);
      storage.updateCurrentTaskData(initalTaskValue);
    }
    setModalVisible(!modalVisible);
  };

  return (
    <Center display={"flex"} bg={"black"} width="full" height={"full"} m="auto">
      <HStack>
        <Text mx="1" color="red.500" fontSize={"2xl"}>
          E
        </Text>
        <Text mx="1" color="yellow.500" fontSize={"2xl"}>
          I
        </Text>
        <Text mx="1" color="blue.500" fontSize={"2xl"}>
          S
        </Text>
        <Text mx="1" color="green.500" fontSize={"2xl"}>
          Y
        </Text>
      </HStack>
      <HStack display={"flex"} justifyContent={"center"} flex="1" width="full">
        <VStack height={"full"} flex={"1"}>
          <EMatrixCell
            toggleModal={toggleModal}
            priority="Urgent & Important"
          />
          <EMatrixCell
            toggleModal={toggleModal}
            priority="Urgent & Unimportant"
          />
        </VStack>
        <VStack height={"full"} flex={"1"}>
          <EMatrixCell
            toggleModal={toggleModal}
            priority="Not Urgent & Important"
          />
          <EMatrixCell
            toggleModal={toggleModal}
            priority="Not Urgent & Unimportant"
          />
        </VStack>
      </HStack>
      <EditTaskModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Center>
  );
};
