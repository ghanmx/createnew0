import { Button, Input, Box } from "@chakra-ui/react";

export const PrimaryButton = (props) => (
  <Button
    bg="blue.500"
    color="white"
    _hover={{ bg: "blue.600" }}
    _active={{ bg: "blue.700" }}
    {...props}
  />
);

export const SecondaryButton = (props) => (
  <Button
    bg="gray.300"
    color="black"
    _hover={{ bg: "gray.400" }}
    _active={{ bg: "gray.500" }}
    {...props}
  />
);

export const StyledInput = (props) => (
  <Input
    borderColor="gray.300"
    _hover={{ borderColor: "gray.400" }}
    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
    {...props}
  />
);

export const Card = (props) => (
  <Box
    bg="white"
    borderRadius="md"
    boxShadow="md"
    p={4}
    {...props}
  />
);