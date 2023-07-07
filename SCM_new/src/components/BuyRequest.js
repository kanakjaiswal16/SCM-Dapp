import React from "react";
import { useEffect, useState } from "react";
import "./CSS/Home.css";
import { useGlobalContext } from "../context";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Heading,
  Button,
  Stack,
  Input,
  Alert,
  AlertIcon,
  useColorMode,
} from "@chakra-ui/react";
import LensTwoTone from "@mui/icons-material/LensTwoTone";

const BuyRequest = () => {
  const urlReq =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/request";

  const urlID =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/listing/items?ID=";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Message");
  const [status, setStatus] = useState("error");
  const { colorMode } = useColorMode();
  const { account, setAccount, contract, setContract, provider, setProvider } =
    useGlobalContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
  const token = localStorage.getItem("token");

  const addItem = async () => {
    try {
      setIsLoading(true);
      const prodID = document.querySelector(".ID").value;
      let Iname = document.querySelector(".Iname").value;
      const amount = parseInt(document.querySelector(".quantity").value);
      const price = parseInt(document.querySelector(".price").value);
      const buyerName = localStorage.getItem("scmName");
      const contact = document.querySelector(".contact").value;
      const seller = document.querySelector(".seller").value;

      Iname = Iname.toUpperCase();

      if (contract !== null) {
        const data_product = await contract.IdTOProduct(prodID);

        // console.log(
        //   data_product.productName,
        //   Number(data_product.productQuantity)
        // );
        if (Number(data_product.productQuantity) !== 0) {
          if (data_product.productName === Iname) {
            if (Number(data_product.productQuantity) >= amount) {
              const { data } = await axios.post(
                urlReq,
                {
                  prodID,
                  Iname,
                  amount,
                  price,
                  buyerName,
                  contact,
                  seller,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setStatus("success");
              setMessage("Resquest sent");
              const alert = document.querySelector(".alert");
              alert.style.display = "flex";
              setIsLoading(false);
              document.querySelector(".ID").value = "";
              document.querySelector(".quantity").value = "";
              document.querySelector(".Iname").value = "";
              document.querySelector(".price").value = "";
              document.querySelector(".seller").value = "";
              document.querySelector(".contact").value = "";
              setTimeout(() => {
                const alert = document.querySelector(".alert");
                alert.style.display = "none";
              }, 2500);
            } else {
              setIsLoading(false);
              alert("Amount should be less than Seller's given amount ");
            }
          } else {
            setIsLoading(false);
            alert("Invaild Product Name");
          }
        } else {
          setIsLoading(false);
          alert("Product Id doesn't exist");
        }
      } else {
        setIsLoading(false);
        alert("Connect Wallet");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response.data.msg);
      setIsLoading(false);
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      //   document.querySelector(".name").value = "";
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 3000);
    }
  };

  return (
    <>
      <Navbar2 />
      <Box
        // position={"relative"}
        minH="90vh"
        bg={"#0d1117"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"flex-start"}
      >
        <Box
          className="alert"
          w={"100vw"}
          display={"none"}
          justifyContent="center"
          position="fixed"
          top={"10px"}
          zIndex="100"
        >
          <Alert
            status={status}
            position={"absolute"}
            w={"auto"}
            variant="solid"
          >
            <AlertIcon />
            {message}
          </Alert>
        </Box>
        <Box
          marginTop={6}
          marginBottom={6}
          width={{ base: "90%", md: "70%", lg: "60%" }}
          border="solid 1px"
          p={2}
          borderRadius={"1rem"}
          backgroundColor={"#0d1117"}
          height={"auto"}
        >
          <Text textAlign={"center"} fontSize={"2xl"} fontWeight="bold">
            Buy Request
          </Text>
          <Stack mt={2} direction={"column"} gap={1}>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Item ID
              </Text>
              <Input className="ID" placeholder="ID" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Item Name
              </Text>
              <Input className="Iname" placeholder="Name" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Quantity
              </Text>
              <Input type={"number"} className="quantity" placeholder="1000" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Price
              </Text>
              <Input type={"number"} className="price" placeholder="100000" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Contact no.
              </Text>
              <Input className="contact" placeholder="Contact" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Seller Id
              </Text>
              <Input className="seller" placeholder="Seller ID" />
            </Box>
          </Stack>
          <Box w={"100%"} display="flex" justifyContent={"center"}>
            {isLoading ? (
              <Button
                isLoading
                loadingText="Loading"
                colorScheme="teal"
                variant="outline"
                spinnerPlacement="start"
                mt={4}
                mb={4}
              >
                Submit
              </Button>
            ) : (
              <Button
                mt={4}
                mb={4}
                w={{ base: "100%", md: "50%" }}
                colorScheme="teal"
                onClick={addItem}
              >
                Send Request
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BuyRequest;
