import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useColorMode,
  Link,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

export default function Login() {
  const url = "https://tiny-jade-marlin-belt.cyclic.app/api/v1/auth/login";
  const [showPassword, setShowPassword] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  if (colorMode == "light") toggleColorMode();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setIsLoading(true);
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#Password").value;
      const { data } = await axios.post(url, { email, password });
      setStatus("success");
      setMessage("Logged In");
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      // setPassword("");
      localStorage.setItem("token", data.token);
      localStorage.setItem("scmName", data.user.name);
      localStorage.setItem("scmRole", data.user.role);
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
        setIsLoading(false);
        navigate("/user");
      }, 500);
    } catch (error) {
      localStorage.removeItem("token");
      setStatus("error");
      setMessage(error.response.data.msg);
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      document.querySelector("#email").value = "";
      setIsLoading(false);
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 3000);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "#0d1117")}
      //   maxW="lg"
    >
      <Alert
        className="alert"
        variant={"solid"}
        status={status}
        position={"absolute"}
        w={"auto"}
        top="20px"
        display={"none"}
        justifyContent="center"
      >
        <AlertIcon />
        {message}
      </Alert>
      <Stack
        spacing={6}
        mx={"auto"}
        maxW={"lg"}
        py={10}
        px={6}
        w={{ base: "90%", sm: "98%" }}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Log in
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input placeholder="username@email.com" type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  id="Password"
                  placeholder="******"
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              {isLoading ? (
                <Button
                  isLoading
                  loadingText="Loading"
                  colorScheme="teal"
                  variant="outline"
                  spinnerPlacement="start"
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={login} variant="outline" colorScheme="teal">
                  Log In
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
