// ** react imports **
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// ** types **
import type Product from "../types/Product";

const BASE_URL = import.meta.env.VITE_API_URL || "localhost:3000";

export const useProducts = () => {
  // ** states **
  const [productIdToSearch, setProductIdToSearch] = useState<string | null>(
    null
  );

  // ** fetch all products **
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch products");
      return res.json();
    },
    enabled: false, // only fetch if ID is provided
  });

  // ** fetch a specific product by ID **
  const {
    data: searchedProduct,
    isLoading: isLoadingSearchedProduct,
    isError: isErrorSearchedProduct,
    error: searchedProductError,
  } = useQuery<Product>({
    queryKey: ["product", productIdToSearch],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/products/${productIdToSearch}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Product not found");
      return json;
    },
    enabled: !!productIdToSearch, // only enable if productIdToSearch is not null
  });

  return {
    // ** products **
    products,
    isProductsLoading,
    isProductsError,
    productsError,

    // ** product search **
    searchedProduct,
    isLoadingSearchedProduct,
    isErrorSearchedProduct,
    searchedProductError,

    // ** states **
    productIdToSearch,
    setProductIdToSearch,
  };
};
