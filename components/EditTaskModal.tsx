import {
  Button,
  CheckIcon,
  Checkbox,
  FormControl,
  HStack,
  Modal,
  Select,
  Text,
} from "native-base";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Priority, Prioritys, matrixColors } from "../utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { storage } from "../storage";
import { observer } from "mobx-react-lite";

export interface NewTaskData {
  id?: string;
  title?: string;
  description?: string;
  priority: Priority;
  dueAt?: Date;
}

// TODO: change to bottom sheet from native-base modal
export const EditTaskModal = observer(
  ({
    modalVisible,
    setModalVisible,
  }: {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
  }) => {
    const [dueDateEnabled, setDueDateEnabled] = useState(false);
    const [dueDate, setDueDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const initialRef = React.useRef<TextInput>(null);
    const finalRef = React.useRef(null);

    useEffect(() => {
      setTimeout(() => {
        initialRef.current?.focus();
      }, 75);
    }, [modalVisible]);

    const closeModal = () => {
      setDatePickerVisible(false);
      setTimePickerVisible(false);
      setModalVisible(false);
    };

    const handleDateChange = (date: Date) => {
      setDatePickerVisible(false);
      if (!dueDateInPast(date)) {
        const newDateTime = new Date(date.getTime());
        newDateTime.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        setDueDate(newDateTime);
        storage.updateCurrentTaskData({
          ...storage.currentTask,
          dueAt: newDateTime,
        });
      }
    };

    const handleTimeChange = (time: Date) => {
      setTimePickerVisible(false);
      if (!dueDateInPast(time)) {
        const newDateTime = new Date(time.getTime());
        newDateTime.setHours(
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
          time.getMilliseconds()
        );
        setDueDate(newDateTime);
        storage.updateCurrentTaskData({
          ...storage.currentTask,
          dueAt: newDateTime,
        });
      }
    };

    const dueDateInPast = (datetime: Date): boolean => {
      if (new Date() > datetime) {
        Toast.show({
          type: "error",
          text1: "The date you picked is in the past!",
        });
        return true;
      } else {
        return false;
      }
    };

    const onSave = () => {
      if (
        storage.currentTask?.title &&
        storage.currentTask?.description &&
        storage.currentTask?.priority
      ) {
        storage.addTask({
          id: uuid.v4().toString(),
          title: storage.currentTask.title,
          description: storage.currentTask.description,
          completed: false,
          priority: storage.currentTask.priority,
          createdAt: new Date(),
        });
      }

      setModalVisible(false);
    };

    return (
      <Modal
        backdropVisible={true}
        closeOnOverlayClick={true}
        isOpen={modalVisible}
        onClose={() => closeModal()}
        // avoidKeyboard
        justifyContent="flex-end"
        size="lg"
      >
        <Modal.Header>Hello</Modal.Header>
        <Modal.Content
          width={"full"}
          roundedBottom={"none"}
          roundedTop={"lg"}
          bg={"gray.900"}
        >
          <Modal.CloseButton />
          <Modal.Body>
            <FormControl>
              <TextInput
                value={storage.currentTask?.title}
                placeholderTextColor={"gray"}
                style={{ color: "white", fontSize: 16, marginBottom: 10 }}
                ref={initialRef}
                placeholder="What is your task?"
                onChangeText={(text) =>
                  storage.updateCurrentTaskData({
                    ...storage.currentTask,
                    title: text,
                  })
                }
              />
              <TextInput
                value={storage.currentTask?.description}
                style={{ color: "white" }}
                placeholderTextColor={"gray"}
                placeholder="Description"
                onChangeText={(text) =>
                  storage.updateCurrentTaskData({
                    ...storage.currentTask,
                    description: text,
                  })
                }
              />
              <HStack alignItems={"center"} w="full" my={2}>
                <Checkbox
                  mr={3}
                  key="checkbox"
                  bg={"gray.900"}
                  value="dueDateEnabled"
                  isChecked={dueDateEnabled}
                  onChange={() => setDueDateEnabled(!dueDateEnabled)}
                >
                  <Text color="white">Due date?</Text>
                </Checkbox>
                {dueDateEnabled && (
                  <>
                    <DateTimePickerModal
                      onConfirm={handleDateChange}
                      onCancel={() => setDatePickerVisible(false)}
                      isVisible={datePickerVisible}
                      mode="date"
                      // onChange={(e) =>
                      //   setDueDate(new Date(e.nativeEvent.timestamp))
                      // }
                      date={dueDate}
                    />
                    <DateTimePickerModal
                      onConfirm={handleTimeChange}
                      onCancel={() => setTimePickerVisible(false)}
                      isVisible={timePickerVisible}
                      mode="time"
                      // onChange={(e) =>
                      //   setDueDate(new Date(e.nativeEvent.timestamp))
                      // }
                      date={dueDate}
                    />
                    <Button
                      mr={3}
                      borderColor={"gray.500"}
                      borderWidth={1}
                      bg={"gray.900"}
                      onPress={() => setDatePickerVisible(true)}
                    >
                      <Text color={"white"}>
                        {dueDate.toLocaleDateString()}
                      </Text>
                    </Button>
                    <Button
                      onPress={() => setTimePickerVisible(true)}
                      borderColor={"gray.500"}
                      borderWidth={1}
                      bg={"gray.900"}
                    >
                      <Text color={"white"}>
                        {dueDate.toLocaleTimeString()}
                      </Text>
                    </Button>
                  </>
                )}
              </HStack>
            </FormControl>

            <HStack mt="2">
              <Select
                flex={1}
                fontSize={"md"}
                color={matrixColors[storage.currentTask?.priority as Priority]}
                accessibilityLabel="Priority"
                _actionSheetContent={{
                  bg: "gray.900",
                }}
                selectedValue={storage.currentTask?.priority}
                _selectedItem={{
                  endIcon: (
                    <CheckIcon
                      color={
                        matrixColors[storage.currentTask?.priority as Priority]
                      }
                      size={5}
                    />
                  ),
                }}
                onValueChange={(value) =>
                  storage.updateCurrentTaskData({
                    ...storage.currentTask,
                    priority: value as Priority,
                  })
                }
              >
                {Prioritys.map((type) => (
                  <Select.Item
                    _text={{ color: "white" }}
                    bg="gray.900"
                    key={type}
                    label={type}
                    value={type}
                  />
                ))}
              </Select>
              <Ionicons
                disabled={
                  !storage.currentTask?.title ||
                  !storage.currentTask?.description
                }
                style={{
                  marginLeft: 20,
                  alignSelf: "center",
                  opacity:
                    !storage.currentTask?.title ||
                    !storage.currentTask?.description
                      ? 0.1
                      : 1,
                }}
                color={"white"}
                onPress={() => onSave()}
                name="save-sharp"
                size={25}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }
);
