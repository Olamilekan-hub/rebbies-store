import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );
          let newProducts;
          if (!cartItem) {
            newProducts = [...state.products, newProduct];
          } else {
            newProducts = state.products.map((product) => {
              if (product.id === cartItem.id) {
                return { ...product, amount: product.amount + newProduct.amount };
              }
              return product;
            });
          }

          // Calculate totals for new products
          let amount = 0;
          let total = 0;
          newProducts.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return {
            products: newProducts,
            allQuantity: amount,
            total: total
          };
        });
      },
      clearCart: () => {
        set((state: any) => {
          
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          const newProducts = state.products.filter(
            (product: ProductInCart) => product.id !== id
          );

          // Calculate totals
          let amount = 0;
          let total = 0;
          newProducts.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return {
            products: newProducts,
            allQuantity: amount,
            total: total
          };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);

          if (!cartItem) {
            return {
              products: [...state.products],
              allQuantity: state.allQuantity,
              total: state.total
            };
          }

          const newProducts = state.products.map((product) => {
            if (product.id === cartItem.id) {
              return { ...product, amount: amount };
            }
            return product;
          });

          // Calculate totals
          let totalAmount = 0;
          let totalPrice = 0;
          newProducts.forEach((item) => {
            totalAmount += item.amount;
            totalPrice += item.amount * item.price;
          });

          return {
            products: newProducts,
            allQuantity: totalAmount,
            total: totalPrice
          };
        });
      },
    }),
    {
      name: "products-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
