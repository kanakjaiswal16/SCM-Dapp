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
  Spinner,
} from "@chakra-ui/react";
import Navbar2 from "./Navbar2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { jsPDF } from "jspdf";
import { sha256 } from "js-sha256";
import { useGlobalContext } from "../context";
import Loader from "./Loader";
import { ethers } from "ethers";

export default function Requests() {
  const url =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/requests?accepted=";
  const urlWallet =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/wallet";
  const urlReject =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/delete/";
  const urlUpdateListed =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/listing/update/";
  const urlUpdateReq =
    "https://tiny-jade-marlin-belt.cyclic.app/api/v1/buying/update/";
  let INDRupees = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState([false]);
  const [heading, setHeading] = useState("Pending Requests");
  const [location, setLocation] = useState(null);
  const [Doc, setDoc] = useState(null);
  const [wallet, setWallet] = useState("");
  const [map, setmap] = useState(null);
  const [lname, setLname] = useState(null);
  // const [req, setReq] = useState("pending");
  const { account, setAccount, contract, setContract, provider, setProvider } =
    useGlobalContext();

  const name = localStorage.getItem("scmName");
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Get the current position
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var locationString = latitude + "," + longitude;
        setLocation(locationString);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        setmap(mapUrl);

        const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        fetch(nominatimApiUrl)
          .then((response) => response.json())
          .then((data) => {
            const locationName = data.display_name;
            setLname(locationName);
          })
          .catch((error) => {
            console.error("Error:", error);
            alert(error);
          });
      });
    } else {
      window.alert("Geolocation is not supported by this browser.");
    }
  }, []);

  async function generateHash(x) {
    const hash = sha256(x);
    return hash;
  }
  const updateListed = async (item) => {
    const u = urlUpdateListed + item.prodID;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        u,
        {
          name: item.buyerName,
          amount: item.amount,
          contact: item.contact,
          createdBy: item.buyer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      alert(error);
    }
  };
  const updateReq = async (item) => {
    const u = urlUpdateReq + item._id;
    try {
      const token = localStorage.getItem("token");
      const d = await axios.patch(
        u,
        {
          accepted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cd = data.filter((i) => {
        return i._id != item._id;
      });
      setData(cd);
    } catch (error) {
      alert(error);
    }
  };
  async function genPdf(item) {
    const cn = ".a" + item._id;
    const load = document.querySelector(cn);
    load.style.visibility = "visible";
    if (contract !== null) {
      if (account === wallet) {
        try {
          let p_id, iName, quantity, price, buyerName, _buyer;

          p_id = item.prodID;
          iName = item.Iname;
          price = item.price;
          quantity = item.amount;
          buyerName = item.buyerName;
          _buyer = item.buyerAccount;

          // data.map((item) => {
          //   p_id = item.prodID;
          //   iName = item.Iname;
          //   price = item.price;
          //   quantity = item.amount;
          //   buyerName = item.buyerName;
          // });

          const doc = new jsPDF();

          // Set background color
          doc.setFillColor(220, 220, 220); // Light gray background color
          doc.rect(
            0,
            0,
            doc.internal.pageSize.getWidth(),
            doc.internal.pageSize.getHeight(),
            "F"
          );

          // Set font size and styling for header
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(34, 34, 34); // Dark gray text color

          // Add header
          doc.text("Product Receipt", 20, 20);

          // Set font size and styling for information labels
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");

          // Add information labels
          doc.text("Product ID: " + p_id, 20, 40);
          doc.text("Name: " + name, 20, 50);
          doc.text("Product Name: " + iName, 20, 60);
          doc.text("Quantity: " + quantity, 20, 70);
          doc.text("Price: " + price, 20, 80);
          doc.text("Location: ", 20, 90);

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 255);
          const text = lname;
          const url = map;
          doc.textWithLink(text, 40, 90, { url });

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(34, 34, 34);
          doc.text("Buyer: " + buyerName, 20, 100);

          // Set font size and styling for footer
          doc.setFontSize(10);
          doc.setTextColor(34, 34, 34); // Dark gray text color

          // Add footer
          const date = new Date();
          const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          doc.text("Receipt generated on:", 20, 130);
          doc.text(formattedDate, 20, 140);

          // Add note in red color
          doc.setTextColor(255, 0, 0); // Red text color
          doc.text(
            "Note: To ensure the integrity of the document and maintain its validity, please refrain from making any ",
            20,
            160
          );
          doc.text(
            "alterations. Even a single modification can render the document invalid.",
            20,
            165
          );

          const generatedPdfContent = doc.output("arraybuffer");
          const hash = await generateHash(generatedPdfContent);

          // console.log(hash);

          const data_product = await contract.IdTOProduct(p_id);

          // console.log(
          //   data_product.productName,
          //   Number(data_product.productQuantity)
          // );

          iName = iName.toUpperCase();
          // console.log(iName);

          if (
            data_product.productName === iName &&
            Number(data_product.productQuantity) >= quantity
          ) {
            const tx = await contract.sellProduct(
              p_id,
              _buyer,
              quantity,
              price,
              location,
              hash
            );
            const txReciept = await tx.wait();

            updateListed(item);
            updateReq(item);
            showCustomDialog(txReciept);

            doc.save(`Product_Reciept_${p_id}.pdf`);
          } else {
            alert("Invalid Buy Request");
          }
        } catch (error) {
          if (error.code === 4001) {
            // User rejected the transaction
            window.alert("Transaction rejected by the user");
          } else if (error.code === -32002) {
            // Insufficient funds
            window.alert("Insufficient funds for the transaction");
          } else if (error.message.includes("NotOwner")) {
            alert("This product doesn't belong to you");
          } else {
            // Handle other error conditions
            window.alert("Error while selling product:", error.message);
          }
        }
      } else {
        alert("Invalid Wallet");
      }
    } else {
      alert("Connect Wallet");
    }
    load.style.visibility = "hidden";
  }

  function showCustomDialog(txReciept) {
    const message = "Transaction Hash: " + txReciept.transactionHash;
    const websiteUrl = `https://sepolia.etherscan.io/tx/${txReciept.transactionHash}`;

    const result = window.confirm(message);
    if (result) {
      window.open(websiteUrl, "_blank");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      let u = url + "false";
      getData(u);
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
  const getData = async (url) => {
    try {
      setIsLoading(true);
      getWallet();
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.requests);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReq = async (id) => {
    const u = urlReject + id;
    const cn = ".a" + id;
    const load = document.querySelector(cn);
    load.style.visibility = "visible";
    try {
      const token = localStorage.getItem("token");
      const d = await axios.delete(u, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cd = data.filter((item) => {
        return item._id != id;
      });
      setData(cd);
    } catch (error) {
      alert(error);
    }
    load.style.visibility = "hidden";
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar2 />
      <Box
        height={"6vh"}
        p={4}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={6}
        marginTop={"1rem"}
      >
        <Button
          variant={"link"}
          colorScheme={"purple"}
          onClick={() => {
            setHeading("Pending Requests");
            getData(url + "false");
          }}
        >
          Pending
        </Button>
        <Button
          variant={"link"}
          colorScheme={"purple"}
          onClick={() => {
            setHeading("Acepted Requests");
            getData(url + "true");
          }}
        >
          Accepted
        </Button>
      </Box>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={4}
      >
        <Heading fontSize={"xl"}>{heading}</Heading>
      </Box>
      {data.length === 0 ? (
        <Heading color={"white"} size={"xl"} p={6}>
          No Requests Available
        </Heading>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          width={"100%"}
          p={0}
          m={0}
        >
          <Box
            className="items"
            p={{ base: 2, md: 6, lg: 8 }}
            textTransform={"capitalize"}
          >
            {data.map((item) => {
              return (
                <Box
                  key={item._id}
                  py={2}
                  flex={{
                    base: "0 0 60%",
                    sm: "0 0 50%",
                    md: "0 0 33.33%",
                    lg: "0 0 20%",
                  }}
                >
                  <Box
                    maxW={"320px"}
                    w={"full"}
                    bg={"gray.900"}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                    textAlign={"center"}
                    position={"relative"}
                  >
                    <Box
                      className={"a" + item._id}
                      position={"absolute"}
                      height={"100%"}
                      width={"100%"}
                      backgroundColor={"#171923"}
                      visibility={"hidden"}
                      zIndex={"2"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      top={"0"}
                      left={"0"}
                    >
                      <Spinner />
                    </Box>
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {`ID - ${item.prodID}`}
                    </Heading>
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {`Item - ${item.Iname}`}
                    </Heading>
                    <Text fontWeight={600} color={"gray.500"}>
                      {`${item.amount} Kg`}
                    </Text>
                    <Text fontWeight={600} color={"gray.500"} mb={2}>
                      {`${INDRupees.format(item.price)}`}
                    </Text>
                    <Heading fontSize={"xl"} fontFamily={"body"}>
                      {`Buyer - ${item.buyerName}`}
                    </Heading>
                    {heading === "Pending Requests" ? (
                      <Stack mt={8} direction={"row"} spacing={4}>
                        <Button
                          flex={1}
                          variant={"outline"}
                          colorScheme="green"
                          fontSize={"sm"}
                          rounded={"full"}
                          onClick={() => genPdf(item)}
                        >
                          {`Accept`}
                        </Button>

                        <Button
                          flex={1}
                          variant={"outline"}
                          colorScheme="red"
                          fontSize={"sm"}
                          rounded={"full"}
                          onClick={() => deleteReq(item._id)}
                        >
                          {`Reject`}
                        </Button>
                      </Stack>
                    ) : (
                      <></>
                    )}
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
