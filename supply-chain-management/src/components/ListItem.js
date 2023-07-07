import React from "react";
import { useEffect, useState } from "react";
import "./CSS/Home.css";
import { useGlobalContext } from "../context";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  Stack,
  Input,
  Alert,
  AlertIcon,
  useColorMode,
} from "@chakra-ui/react";

const ListItem = () => {
  var now = new Date();
  var minDate = now.toISOString().substring(0, 10);
  const urlWallet =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/wallet";
  const url = "https://tiny-jade-marlin-belt.cyclic.app/api/v1/listing/item";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Message");
  const [status, setStatus] = useState("error");
  const [ID, setID] = useState();
  const { colorMode } = useColorMode();
  const [wallet, setWallet] = useState("");
  const { account, setAccount, contract, setContract, provider, setProvider } =
    useGlobalContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getWallet();
    }
  }, []);
  const token = localStorage.getItem("token");

  const getWallet = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(urlWallet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      setWallet(data.account);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  async function add(prodID, name, role, Iname, harvestDate, amount, contact) {
    try {
      const { data } = await axios.post(
        url,
        {
          prodID,
          name,
          role,
          Iname,
          harvestDate,
          amount,
          contact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus("success");
      setMessage("Item Added");
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      setIsLoading(false);
      document.querySelector(".Iname").value = "";
      document.querySelector(".harvest").value = "";
      document.querySelector(".amount").value = "";
      document.querySelector(".contact").value = "";
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 500);
    } catch (error) {
      console.log(error);
      setStatus("error");
      setMessage(error.response.data.msg);
      setIsLoading(false);
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 3000);
    }
  }

  const addItem = async () => {
    try {
      if (contract !== null) {
        if (account === wallet) {
          try {
            setIsLoading(true);
            const name1 = localStorage.getItem("scmName");
            const role = localStorage.getItem("scmRole");
            let Iname = document.querySelector(".Iname").value;
            const harvestDate = document.querySelector(".harvest").value;
            const amount = parseInt(document.querySelector(".amount").value);
            const contact = document.querySelector(".contact").value;
            //   console.log(name, role, Iname, harvest, amount, contact);
            Iname = Iname.toUpperCase();
            // console.log(Iname);
            const tx = await contract.assignProduct(Iname, amount);
            await tx.wait();
            const id = await contract.deriveLastId();
            // console.log(Number(id));
            add(Number(id), name1, role, Iname, harvestDate, amount, contact);
          } catch (error) {
            setIsLoading(false);
            if (error.code === 4001) {
              // User rejected the transaction
              window.alert("Transaction rejected by the user");
            } else if (error.code === -32002) {
              // Insufficient funds
              window.alert("Insufficient funds for the transaction");
            } else {
              // Handle other error conditions
              window.alert("Error while selling product:", error.message);
            }
          }
        } else {
          alert("Invalid Wallet Address");
        }
      } else {
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
            Add Item
          </Text>
          <Stack mt={2} direction={"column"} gap={1}>
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
                Harvest Date
              </Text>
              <Input
                type="Date"
                max={minDate}
                className="harvest"
                placeholder="Date"
              />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Amount (in kg's)
              </Text>
              <Input type="number" className="amount" placeholder="amount" />
            </Box>
            <Box display={"flex"} gap={2} alignItems="center">
              <Text
                w={{ base: "40%", md: "30%", lg: "20%" }}
                fontSize={"lg"}
                fontWeight={"600"}
              >
                Contact No.
              </Text>
              <Input className="contact" placeholder="contact" />
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
                List Item
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ListItem;
