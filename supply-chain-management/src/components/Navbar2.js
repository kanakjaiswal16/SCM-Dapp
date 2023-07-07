import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import "./CSS/Navbar2.css";
import WalletIcon from "@mui/icons-material/Wallet";
import { ethers } from "ethers";
import SCM from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar2() {
  const url = "https://tiny-jade-marlin-belt.cyclic.app/api/v1/listing/myId";
  const { name, setName } = useGlobalContext();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const n = localStorage.getItem("scmName");
    const r = localStorage.getItem("scmRole");
    if (n) {
      setName(n);
      setRole(r);
    } else {
      navigate("/login");
    }
  }, []);

  const { account, setAccount, contract, setContract, provider, setProvider } =
    useGlobalContext();
  var userAgent = navigator.userAgent.toLowerCase();
  var isAndroid = userAgent.indexOf("android") > -1;
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
        let contractAddress = "0x57A858B4C90f3A4179CC1A999278B64Aa5ddc961";
        const contract = new ethers.Contract(contractAddress, SCM.abi, signer);

        setContract(contract);
        setProvider(provider);
        // console.log(typeof contract);
      };
      provider && loadProvider();
    } else {
      if (!isAndroid) alert("Install Metamask");
    }
  }

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("scmName");
    localStorage.removeItem("scmRole");
    navigate("/");
  };

  const token = localStorage.getItem("token");
  const getId = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      alert(`Your Id: ${data.id}`);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <Box>
      <Flex
        bg="gray.800"
        color="white"
        minH={"60px"}
        height={"10vh"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.900"
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "#e5c453")}
            fontWeight={"600"}
            letterSpacing={"1px"}
            onClick={() => navigate("/")}
            cursor={"pointer"}
          >
            SCM
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            onClick={ButtonClick}
            rightIcon={<WalletIcon />}
            colorScheme="green"
            variant="solid"
            overflow={"hidden"}
            maxWidth={"100%"}
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
          <Box display={{ base: "none", md: "inline-flex" }}>
            <Menu>
              <MenuButton
                variant="ghost"
                as={Button}
                rightIcon={<ChevronDownIcon />}
                textTransform="capitalize"
                p={1}
                position="relative"
              >
                {name}
                <Text
                  color={"gray.400"}
                  fontSize={"x-small"}
                  bottom={"0"}
                  position={"absolute"}
                >
                  {role}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem closeOnSelect={false} onClick={getId}>
                  {isLoading ? "Loading..." : "Your Id"}
                </MenuItem>
                <MenuItem onClick={() => navigate("/yourItems")}>
                  Your Listed Items
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={signOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();
  // const onclk = NAV_ITEMS.onclk;
  const handleClick = (onclk) => {
    if (onclk === "signOut") {
      localStorage.removeItem("token");
      localStorage.removeItem("scmName");
      localStorage.removeItem("scmRole");
      navigate("/");
    } else if (onclk === "listing") {
      navigate("/listItem");
    } else if (onclk === "items") {
      navigate("/items");
    } else if (onclk === "buyReq") {
      navigate("/buyRequest");
    } else if (onclk === "requests") {
      navigate("/requests");
    }
  };

  return (
    <Stack direction={"row"} spacing={4} align="center">
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                // href={navItem.href ?? "#"}
                onClick={() => handleClick(navItem.onclk)}
                fontSize={"md"}
                fontWeight={600}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, onclk }: NavItem) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onclk === "signOut") {
      localStorage.removeItem("token");
      localStorage.removeItem("scmName");
      localStorage.removeItem("scmRole");
      navigate("/");
    } else if (onclk === "listing") {
      navigate("/listItem");
    }
  };
  return (
    <Link
      onClick={handleClick}
      // href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={600}
            onClick={handleClick}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onclk }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const handleClick = () => {
    if (onclk == "signOut") {
      localStorage.removeItem("token");
      localStorage.removeItem("scmName");
      localStorage.removeItem("scmRole");
      navigate("/");
    } else if (onclk === "listing") {
      navigate("/listItem");
    } else if (onclk === "items") {
      navigate("/items");
    } else if (onclk === "buyReq") {
      navigate("/buyRequest");
    } else if (onclk === "requests") {
      navigate("/requests");
    }
  };
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        // href={href ?? "#"}
        onClick={handleClick}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "List for Sale",
    onclk: "listing",
    href: "#",
  },
  {
    label: "Items For Sale",
    onclk: "items",
    href: "#",
  },
  {
    label: "Send Buy Request",
    onclk: "buyReq",
    href: "#",
  },
  {
    label: "Buy Requests",
    onclk: "requests",
    href: "#",
  },
  {
    label: "Sign Out",
    onclk: "signOut",
    href: "#",
  },
];
