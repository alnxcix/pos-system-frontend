// ** react imports **
import { useState } from "react";

// ** types **
import Product from "../types/Product";
import UtilityFunctionResult from "../types/UtilityFunctionResult";

export const useCart = () => {
  // ** states **
  const [qty, setQty] = useState<number>(1);
  const [orderList, setOrderList] = useState<
    (Product & { qty: number; amount: number })[]
  >([]);
  const [cash, setCash] = useState<number>(0);

  // ** consts **
  const totalAmount = orderList.reduce((sum, item) => sum + item.amount, 0);
  const change = cash - totalAmount;

  // ** functions **
  const handleAddToCart = (searchedProduct: Product) => {
    if (!searchedProduct || qty <= 0) return;

    setOrderList((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === searchedProduct.id
      );

      if (existingIndex !== -1) {
        // Update qty + amount if product already exists
        const updated = [...prev];
        const existingItem = updated[existingIndex];
        const newQty = existingItem.qty + qty;
        updated[existingIndex] = {
          ...existingItem,
          qty: newQty,
          amount: newQty * existingItem.cost,
        };
        return updated;
      }

      // Add new product if not in cart
      return [
        ...prev,
        {
          ...searchedProduct,
          qty,
          amount: qty * searchedProduct.cost,
        },
      ];
    });

    setQty(1);
  };

  const handleRemove = (id: string) => {
    setOrderList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (): UtilityFunctionResult => {
    const result: UtilityFunctionResult = { success: false };
    if (cash < totalAmount) {
      result.success = false;
      result.message = "Insufficient cash!";
      return result;
    }

    result.success = true;
    result.message = "Transaction saved!";
    result.data = { transaction: { orderList, totalAmount, cash, change } };

    // ** reset **
    setOrderList([]);
    setCash(0);

    return result;
  };

  return {
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
  };
};
