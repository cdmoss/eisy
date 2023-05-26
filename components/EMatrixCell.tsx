import {
  Box,
  Checkbox,
  Divider,
  Flex,
  HStack,
  ScrollView,
  Text,
  VStack,
  Pressable,
  Button,
  AddIcon,
} from "native-base";
import React from "react";
import { NewTaskData, Task, storage } from "../storage";
import { observer } from "mobx-react-lite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "react-router-native";
import { Priority, matrixColors } from "../utils";

export const TaskListItem = ({
  task,
  matrixType,
  toggleModal,
}: {
  task: Task;
  matrixType: Priority;
  toggleModal: (initalTaskValue: NewTaskData) => void;
}) => {
  return (
    <HStack width={"full"} alignItems={"center"} ml="2" mt="1">
      <Checkbox
        mr={2}
        isChecked={task.completed}
        onChange={() => storage.toggleCompleted(task.id)}
        colorScheme={matrixColors[matrixType].split(".")[0]}
        value={task.id}
        bg="black"
        borderColor={matrixColors[matrixType]}
        accessibilityLabel=" "
      />
      <Pressable
        flex={"1"}
        onPress={() =>
          toggleModal({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
          })
        }
      >
        <Text
          strikeThrough={task.completed ? true : false}
          fontSize={"sm"}
          color={task.completed ? "gray.700" : "white"}
        >
          {task.title}
        </Text>
        {/* TODO: Add time left until duedate */}
      </Pressable>
    </HStack>
  );
};

export const EMatrixCell = observer(
  ({
    priority,
    toggleModal,
  }: {
    priority: Priority;
    toggleModal: (initalTaskValue: NewTaskData) => void;
  }) => {
    return (
      <Pressable
        p="2"
        m={"1"}
        rounded={"md"}
        borderColor={matrixColors[priority]}
        borderWidth={1}
        flex={1}
      >
        <Text
          width={"full"}
          color={matrixColors[priority]}
          textAlign={"center"}
        >
          {priority}
        </Text>
        <Divider bg={matrixColors[priority]} />
        <VStack height={"full"} flex="1" bg={"black"}>
          <VStack width={"full"}>
            <ScrollView>
              <Flex direction="column">
                {storage.tasks
                  .filter((task) => task.priority == priority)
                  .map((task) => (
                    <TaskListItem
                      toggleModal={toggleModal}
                      key={task.id}
                      task={task}
                      matrixType={priority}
                    />
                  ))}
              </Flex>
            </ScrollView>
          </VStack>
        </VStack>
        <Button
          onPress={() => toggleModal({ priority: priority })}
          alignSelf={"flex-end"}
          bg={"black"}
          color={matrixColors[priority]}
          width={"full"}
          _pressed={{
            bg: "gray.900",
            borderColor: matrixColors[priority],
            borderWidth: 1,
          }}
        >
          <AddIcon size={5} color={matrixColors[priority]} />
        </Button>
      </Pressable>
    );
  }
);
