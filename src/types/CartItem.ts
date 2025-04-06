import Product from "./Product";

type CartItem = Product & {
  qty: number;
  amount: number;
};

export default CartItem;
