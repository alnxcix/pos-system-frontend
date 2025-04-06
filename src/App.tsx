import React, { useEffect, useState } from "react";
import { Input, Button, Table, InputNumber, message } from "antd";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { ColumnsType } from "antd/es/table";
import CartItem from "./types/CartItem";
import UtilityFunctionResult from "./types/UtilityFunctionResult";

const App: React.FC = () => {
  // ** hooks **
  const {
    isErrorSearchedProduct,
    searchedProductError,
    setProductIdToSearch,
    searchedProduct,
    isLoadingSearchedProduct,
  } = useProducts();

  const {
    qty,
    orderList,
    cash,
    totalAmount,
    change,
    setQty,
    setCash,
    handleAddToCart,
    handleRemove,
    handleSave,
  } = useCart();

  // ** antd **
  const [messageApi, contextHolder] = message.useMessage();

  // ** states **
  const [searchId, setSearchId] = useState("");

  const columns: ColumnsType<CartItem> = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Cost", dataIndex: "cost" },
    { title: "Qty", dataIndex: "qty" },
    { title: "Amount", dataIndex: "amount" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleRemove(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  // ** functions **
  const displayMessage = (callbackFunc: () => UtilityFunctionResult) => {
    const result = callbackFunc();
    if (result.success) messageApi.success(result.message);
    else messageApi.error(result.message);
  };

  // ** useEffect declarations **
  useEffect(() => {
    if (isErrorSearchedProduct) {
      messageApi.error(searchedProductError?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorSearchedProduct]);

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
        <h2>🛒 POS System</h2>

        <Input.Group compact>
          <Input
            placeholder="Search Product ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: "60%" }}
            disabled={isLoadingSearchedProduct}
          />
          <Button
            onClick={() => setProductIdToSearch(searchId)}
            type="primary"
            loading={isLoadingSearchedProduct}
          >
            Search
          </Button>
        </Input.Group>

        {
          <div style={{ marginTop: 16 }}>
            <p>
              <strong>ID:</strong> {searchedProduct?.id}
            </p>
            <p>
              <strong>Product Name:</strong> {searchedProduct?.name}
            </p>
            <p>
              <strong>Cost:</strong> ₱{searchedProduct?.cost}
            </p>
            <p>
              <strong>
                Qty:{" "}
                <InputNumber
                  min={1}
                  value={qty}
                  onChange={(value) => setQty(value!)}
                />
              </strong>
              <Button
                disabled={!searchedProduct}
                type="dashed"
                onClick={() => {
                  handleAddToCart(searchedProduct!);
                }}
                style={{ marginLeft: 8 }}
              >
                Add to Cart
              </Button>
            </p>
          </div>
        }

        <h3 style={{ marginTop: 32 }}>Order List</h3>
        <Table
          dataSource={orderList}
          columns={columns}
          rowKey="id"
          pagination={false}
        />

        <div style={{ marginTop: 24 }}>
          <p>
            <strong>Total Amount:</strong> ₱{totalAmount}
          </p>
          <p>
            <strong>Cash:</strong>{" "}
            <InputNumber
              placeholder="Cash"
              value={cash}
              onChange={(value) => setCash(value!)}
            />
          </p>

          <p>
            <strong>Change:</strong> ₱{change >= 0 ? change : 0}
          </p>
          <Button
            type="primary"
            onClick={() => {
              displayMessage(handleSave);
            }}
            disabled={orderList.length < 1}
          >
            Save Transactions
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
