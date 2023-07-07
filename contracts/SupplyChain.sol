//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract SupplyChain {
    struct productDetails {
        uint productID;
        string productName;
        uint productQuantity;
        uint[] productPrice;
        string[] productLocation;
        uint[] productTimestamp;
        address productOwner;
    }
    uint public id;
    address public owner;
    mapping(uint => productDetails) public IdTOProduct;
    mapping(uint => address[]) private productOwnerHistory;
    mapping(string => bool) public pdfHash;
    mapping(address => uint[]) public UserProductList;
    mapping(uint => bool) public isSell;
    mapping(address => bool) public bUser;
    mapping(uint => uint[]) private productQuant;
    bool listing = true;

    //events
    event ProductAssign(uint _id, string name, uint quantity);
    event ProductSell(
        uint id,
        string name,
        uint quantity,
        uint price,
        string location,
        uint time
    );

    constructor() {
        owner = msg.sender;
        id = 1000;
    }

    //TO list Product
    function assignProduct(string calldata name, uint quantity) public {
        require(listing == true, "Paused");
        require(bUser[msg.sender] == false, "Blocked");
        productDetails memory newProduct;
        newProduct.productID = id;
        newProduct.productName = name;
        newProduct.productQuantity = quantity;
        newProduct.productOwner = msg.sender;
        IdTOProduct[id] = newProduct;
        productOwnerHistory[id].push(msg.sender);
        productQuant[id].push(quantity);
        UserProductList[msg.sender].push(id);
        emit ProductAssign(id, name, quantity);
        id++;
    }

    //TO sell product
    function sellProduct(
        uint _id,
        address _buyer,
        uint _quantity,
        uint _price,
        string calldata location,
        string calldata _hash
    ) public {
        require(msg.sender == IdTOProduct[_id].productOwner, "NotOwner");
        require(bUser[msg.sender] == false, "Blocked");
        IdTOProduct[_id].productPrice.push(_price);
        IdTOProduct[_id].productTimestamp.push(block.timestamp);
        IdTOProduct[_id].productLocation.push(location);
        IdTOProduct[_id].productQuantity = _quantity;
        IdTOProduct[_id].productOwner = _buyer;
        productOwnerHistory[_id].push(_buyer);
        productQuant[_id].push(_quantity);
        isSell[_id] = true;
        pdfHash[_hash] = true;
        emit ProductSell(
            _id,
            IdTOProduct[id].productName,
            IdTOProduct[id].productQuantity,
            _price,
            location,
            block.timestamp
        );
    }

    //Retrieve Owner History
    function ownerHistory(uint _id) public view returns (address[] memory) {
        return productOwnerHistory[_id];
    }

    //Retrieve Product details
    function getProductDetails(
        uint _id
    )
        public
        view
        returns (
            uint productID,
            string memory productName,
            uint productQuantity,
            uint[] memory productPrice,
            string[] memory productLocation,
            uint[] memory productTimestamp,
            address productOwner
        )
    {
        require(999 < _id && _id < id, "Invalid product ID");
        require(isSell[_id] == true, "Product not Sell");
        productDetails memory product = IdTOProduct[_id];
        return (
            product.productID,
            product.productName,
            product.productQuantity,
            product.productPrice,
            product.productLocation,
            product.productTimestamp,
            product.productOwner
        );
    }

    function blockUser(address x) public onlyOwner {
        bUser[x] = true;
    }

    function stopListing() public onlyOwner {
        listing = false;
    }

    function deriveLastId() public view returns (uint) {
        uint[] memory products = UserProductList[msg.sender];
        uint len = products.length;

        return products[len - 1];
    }

    function getproductQuant(uint _id) public view returns (uint[] memory) {
        return productQuant[_id];
    }

    //modifiers;
    modifier onlyOwner() {
        require(msg.sender == owner, "NotOwner");
        _;
    }
}
