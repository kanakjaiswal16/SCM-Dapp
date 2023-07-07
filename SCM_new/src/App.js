import "./App.css";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import User from "./components/User";
import ListItem from "./components/ListItem";
import Items from "./components/Items";
import BuyRequest from "./components/BuyRequest";
import Requests from "./components/Requests";
import YourItems from "./components/YourItems";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import MyPDF from "./components/1";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/listItem" element={<ListItem />} />
          <Route path="/items" element={<Items />} />
          <Route path="/buyRequest" element={<BuyRequest />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/checkReceipt" element={<MyPDF />} />
          <Route path="/yourItems" element={<YourItems />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
