import React, { useState } from "react";
import { useEffect } from "react";
import "./CSS/Home.css";
import {
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Spinner,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import { useGlobalContext } from "../context";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import SCM from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import axios from "axios";

const User = () => {
  let INDRupees = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  const navigate = useNavigate();
  const [id, setid] = useState(null);
  const [prices, setPrices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [time, setTime] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/-4e5fsDjluNgzUNf9u0nNElwVvNV2QYq"
  );
  const wallet = new ethers.Wallet(
    "9950025c546ede2c2bb22c6dd3b984efe4f7622c4e22eb26f7facffad32e099b",
    provider
  );
  const contract = new ethers.Contract(
    "0x57A858B4C90f3A4179CC1A999278B64Aa5ddc961",
    SCM.abi,
    wallet
  );

  function HandleInputChange(e) {
    setid(e.target.value);
  }

  // useEffect(() => {
  //   setLocations(locationNames);
  // }, [locationNames]);

  const getLocationName = async (array) => {
    let locationNames = [];
    await Promise.all(
      array.map(async (location) => {
        const arr = location.split(",");
        const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${arr[0]}&lon=${arr[1]}&format=json`;
        try {
          const { data } = await axios.get(nominatimApiUrl);
          const name =
            data.address.state_district +
            ", " +
            data.address.state +
            ", " +
            data.address.country;
          locationNames.push(name);
        } catch (error) {
          alert(error);
        }
      })
    );
    setLocations(locationNames);
  };

  async function fetch() {
    const table = document.querySelector(".itemInfo");
    table.style.display = "none";
    setIsLoading(true);
    try {
      const product = await contract.getProductDetails(id);
      const productQuant = await contract.getproductQuant(id);
      setTime(product.productTimestamp);
      setQuantity(productQuant);
      setPrices(product.productPrice);
      setLocations(product.productLocation);
      getLocationName(product.productLocation);
      setProduct(product);
      table.style.display = "flex";
      setIsLoading(false);
    } catch (error) {
      if (error.message.includes("Invalid product ID")) {
        setIsLoading(false);
        alert("Product ID doesn't exist");
      }

      if (error.message.includes("Product not Sell")) {
        setIsLoading(false);
        alert("Product has not been sold");
      } else {
        setIsLoading(false);
        alert(error);
      }
    }
  }
  return (
    <>
      <Navbar2 />
      <div className="Home-body">
        <div className="content">
          <h1>Welcome to Supply Chain DAPP</h1>
          <p>
            This is a Decentralized Application that stores the history of goods
            from the producers to manufacturer, with all the information about
            the price history,locations and time stamps.
          </p>
          <p className="enter">Enter the product Id to check its information</p>
          <div className="search">
            <Input
              placeholder="Enter Product ID"
              onChange={HandleInputChange}
            />
            {isLoading ? (
              <Button
                isLoading
                colorScheme="teal"
                variant="outline"
                spinnerPlacement="start"
                p={0}
              >
                Submit
              </Button>
            ) : (
              <Button onClick={fetch} colorScheme="teal" variant="solid">
                <SearchIcon />
              </Button>
            )}
          </div>
          <Text>
            Have a transaction reciept{" "}
            <Link color="teal.500" onClick={() => navigate("/checkReceipt")}>
              Click Here
            </Link>{" "}
            to check if its original
          </Text>
        </div>

        <div className="itemInfo">
          <TableContainer
            w={"auto"}
            border={"1px solid grey"}
            borderRadius={"1rem"}
            p={4}
            bg={"#010409"}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"start"}
              alignContent={"start"}
              mb={2}
            >
              <Text>{`ID : ${Number(product.productID)}`}</Text>
              <Text
                textTransform={"capitalize"}
              >{`Name : ${product.productName}`}</Text>
            </Box>
            <Table variant="simple">
              <TableCaption>Item History</TableCaption>
              <Thead>
                <Tr>
                  <Th>Prices</Th>
                  <Th>Locations</Th>
                  <Th>Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {prices.map((price, index) => {
                  const d = new Date(
                    Number(time[index]) * 1000
                  ).toLocaleString();

                  return (
                    <Tr key={price}>
                      <Td>
                        {INDRupees.format(price) +
                          " (" +
                          quantity[index + 1] +
                          " kg)"}
                      </Td>
                      <Td>{locations[index]}</Td>
                      <Td>{d}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default User;
