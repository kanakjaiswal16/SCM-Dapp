import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Input,
  Flex,
} from "@chakra-ui/react";
import Navbar2 from "./Navbar2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "./Loader";
import axios from "axios";
import "./CSS/Items.css";

export default function YourItems() {
  const url =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/listing/yourItems";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState([false]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getData(url);
    }
  }, []);
  const token = localStorage.getItem("token");
  const getData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.items);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      // <Flex h={"100vh"} w="100%" justify="center" align="center">
      <Loader />
      // </Flex>
    );
  }

  return (
    <>
      <Navbar2 />
      {/* <Box
        height={"6vh"}
        p={4}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        marginTop={"1rem"}
      >
        <Input
          border={"1px solid pink"}
          width={{ base: "100%", sm: "80%", md: "70%", lg: "50%" }}
          placeholder="Search for specific Good"
          className="searchBar"
        />
        <Button variant={"solid"} colorScheme={"purple"} onClick={search}>
          <SearchIcon />
        </Button>
      </Box> */}
      {data.length === 0 ? (
        <Heading color={"white"} size={"xl"} p={6}>
          No Items Available
        </Heading>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          width={"100%"}
          p={0}
          m={0}
          // bg={"red"}
        >
          <Box
            className="items"
            p={{ base: 2, md: 6, lg: 8 }}
            textTransform={"capitalize"}
          >
            {data.map((item) => {
              return (
                <Box key={item._id} py={2}>
                  <Box
                    maxW={"320px"}
                    w={"full"}
                    bg={"gray.900"}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                    textAlign={"center"}
                  >
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {`ID - ${item.prodID}`}
                    </Heading>
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {`Item - ${item.Iname}`}
                    </Heading>
                    <Text fontWeight={600} color={"gray.500"} mb={2}>
                      {`${item.amount} Kg`}
                    </Text>
                    <Heading fontSize={"xl"} fontFamily={"body"}>
                      {`Seller - ${item.name}`}
                    </Heading>
                    <Text fontWeight={600} color={"gray.500"} mb={4}>
                      {item.role}
                    </Text>
                    <Box textAlign={"center"} color={"gray.400"} px={3}>
                      <Text fontWeight={"600"} color={"white"}>
                        Harvested on{" "}
                      </Text>
                      <Text color={"#e95065"}>{item.harvestDate}</Text>
                    </Box>

                    <Stack mt={8} direction={"row"} spacing={4}>
                      <Button
                        flex={1}
                        variant={"outline"}
                        colorScheme="green"
                        fontSize={"sm"}
                        rounded={"full"}
                      >
                        {`Contact - ${item.contact}`}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
}
