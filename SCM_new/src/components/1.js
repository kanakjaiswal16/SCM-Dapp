import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { sha256 } from "js-sha256";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import Navbar2 from "./Navbar2";
import SCM from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { Input, Box, Button, Text, Alert, AlertIcon } from "@chakra-ui/react";
const MyPDF = () => {
  const pdfRef = useRef(null);
  const [pdf, setpdf] = useState(null);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("error");

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

  const handlePDFInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const actualPdfContent = reader.result;
        // console.log(typeof actualPdfContent);
        // console.log(actualPdfContent);

        const actualPdfHash = sha256(actualPdfContent);
        // console.log(actualPdfHash);
        setpdf(actualPdfHash);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  async function check() {
    if (pdf) {
      const hashcheck = await contract.pdfHash(pdf);
      if (hashcheck) {
        setStatus("success");
        setMessage("Receipt is original");
        const alert = document.querySelector(".alert");
        alert.style.display = "flex";
        setTimeout(() => {
          const alert = document.querySelector(".alert");
          alert.style.display = "none";
        }, 3000);
      } else {
        setStatus("error");
        setMessage("Receipt is not original");
        const alert = document.querySelector(".alert");
        alert.style.display = "flex";
        setTimeout(() => {
          const alert = document.querySelector(".alert");
          alert.style.display = "none";
        }, 3000);
      }
    } else {
      setStatus("error");
      setMessage("Upload a pdf");
      const alert = document.querySelector(".alert");
      alert.style.display = "flex";
      setTimeout(() => {
        const alert = document.querySelector(".alert");
        alert.style.display = "none";
      }, 1000);
    }
  }

  return (
    <>
      {token ? <Navbar2 /> : <Navbar />}
      <Box
        height={"90vh"}
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexDirection={"column"}
        color="white"
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
        <Text mt={4} fontWeight={"600"} fontSize={"2xl"}>
          Upload the Receipt
        </Text>

        <Input
          mt={8}
          width={"auto"}
          border={"none"}
          type="file"
          accept=".pdf"
          onChange={handlePDFInputChange}
        />
        <Button variant={"solid"} colorScheme="red" onClick={check}>
          Upload
        </Button>
      </Box>
    </>
  );
};

export default MyPDF;
