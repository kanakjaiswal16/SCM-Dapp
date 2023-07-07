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
  Link,
  Alert,
  AlertIcon,
  useColorMode,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import WalletIcon from "@mui/icons-material/Wallet";
import { useGlobalContext } from "../context";
import { ethers } from "ethers";
import SCM from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

export default function Register() {
  const url = "https://tiny-jade-marlin-belt.cyclic.app/api/v1/auth/register";
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  if (colorMode == "light") toggleColorMode();
  const navigate = useNavigate();
  const signIn = () => {
    navigate("/login");
  };
  const { account, setAccount, contract, setContract, provider, setProvider } =
    useGlobalContext();
  const isAndroid = /android/i.test(navigator.userAgent);
  // console.log(isAndroid);
  async function ButtonClick() {
    // console.log("window.ethereum:", window.ethereum);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // console.log("provider:", provider);
      const loadProvider = async () => {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x3B117Ff72803eadECDc3944e414B5fb0931d872C";
        const contract = new ethers.Contract(contractAddress, SCM.abi, signer);

        setContract(contract);
        setProvider(provider);
        // console.log(typeof contract);
      };
      provider && loadProvider();
    } else {
      if (!isAndroid) alert("Install Metamask");
    }
    // console.log(account);
  }

  const register = async () => {
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#Email").value;
    let password = document.querySelector("#Password").value;
    let role = document.querySelector("#role").value;

    try {
      setIsLoading(true);
      const res = await axios.post(url, {
        name,
        role,
        email,
        password,
        account,
      });
      // setPassword("");
      setStatus("success");
      setMessage("User Created");
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
        setIsLoading(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(error.response.data.msg);
      // setPassword("");
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      document.querySelector("#name").value = "";
      // document.querySelector("#Email").value = "";
      // document.querySelector("#Password").value = "";
      document.querySelector("#role").value = "";
      setIsLoading(false);
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 3000);
    }
  };
  return (
    <>
      <Box
        minHeight={"10vh"}
        bgColor={"#010409"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={6}
      >
        <Text
          ml={4}
          color={"#e95065"}
          width={{ base: "50%", md: "auto", lg: "auto" }}
        >
          Future transactions can only be made with the wallet connected now
        </Text>
        <Button
          onClick={ButtonClick}
          rightIcon={<WalletIcon />}
          colorScheme="green"
          variant="solid"
          overflow={"hidden"}
          maxWidth={"100%"}
          mr={4}
          // p={4}
          width={{ base: "50%", md: "auto", lg: "auto" }}
        >
          {isAndroid === false ? (
            account === null ? (
              "Connect"
            ) : (
              "Connected"
            )
          ) : (
            <a href="https://metamask.app.link/dapp/supply-chain-management-l0j5ryepd-nrs08.vercel.app/">
              Connect
            </a>
          )}
        </Button>
      </Box>
      <Flex minH={"90vh"} align={"center"} justify={"center"} bg={"#0d1117"}>
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
        <Stack spacing={6} mx={"auto"} maxW={"lg"} py={0} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            {/* <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features 
          </Text> */}
          </Stack>
          <Box rounded={"lg"} bg={"gray.800"} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input id="name" placeholder="Name" type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select id="role" placeholder="Select role">
                      <option value="Farmer">Farmer</option>
                      <option value="Distributer">Distributer</option>
                      <option value="Exporter">Exporter</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  id="Email"
                  placeholder="username@email.com"
                  type="email"
                />
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
                  <Button
                    onClick={register}
                    variant="outline"
                    colorScheme="teal"
                  >
                    Sign in
                  </Button>
                )}
              </Stack>
              <Stack pt={2}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link onClick={signIn} color={"blue.400"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
