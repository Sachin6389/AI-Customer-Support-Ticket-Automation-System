import { createSlice,createAsyncThunk  } from '@reduxjs/toolkit';
import axios from "axios"
import {toast} from "react-toastify"

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
const loadfinalFromStorage = () => {
  try {
    const saved = localStorage.getItem("final");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
const amount = () => {
  localStorage.getItem("totalAmount");
};


 
  

  
   export const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
  try {
    const backendURL = import.meta.env.VITE_BACKEND_URL_PRODUCT;
    const response = await axios.get(`${backendURL}/all-products`);
    
    

    if (response.data.success) {
      const data = response.data.data ||  [];
    
      
      return Array.isArray(data) ? data : [data]; // always array
    } else {
      toast.error("No products found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error(error.message);
    return [];
  }
});
    


const initialState = {
  FinalOrder: loadfinalFromStorage(),
  
  search: "",
  cart: loadCartFromStorage(),
  currency: "₹",
  showsearch: false,
  countItem: null,
  TottalAmount: amount(),
  productList:[],
};
const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    orderDate: (state, action) => {
  state.orderDate = action.payload; // Save date
  localStorage.setItem("orderDate", JSON.stringify(action.payload));
},

    FinalOderItem: (state, action) => {
      
    },
    

    addtocart: (state, action) => {
      const newItems = action.payload;

      newItems.forEach((newItem) => {
        const index = state.cart.findIndex(
          (item) => item._id == newItem._id && item.price == newItem.price
        );

        if (index > -1) {
          // update existing quantity
          state.cart[index].quantity = newItem.quantity;
        } else {
          // push new item
          state.cart.push(newItem);
        }
        localStorage.setItem("cart", JSON.stringify(state.cart));
      });
    },
    removeFromCart: (state, action) => {
      const { _id, price } = action.payload;

      state.cart = state.cart.filter(
        (item) => !(item._id === _id && item.price === price)
      );

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    searchItem: (state, action) => {
      state.search = action.payload;
    },
    showsearchStatus: (state, action) => {
      state.showsearch = action.payload;
    },
    cartItemCount: (state, action) => {
      state.countItem = action.payload;
      state.currency = currency;
    },
    TottalAmounts: (state, action) => {
      state.TottalAmount = action.payload;
      localStorage.setItem("totalAmount" ,action.payload)
      
    },
    clearCart: (state,action) => {
      state.cart = [];
      localStorage.removeItem("cart");

    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload; 
        
        // ✅ plain array only
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const {
  TottalAmounts,
  cartItemCount,
  showsearchStatus,
  searchItem,
  addtocart,
  removeFromCart,
  orderDate,
  FinalOderItem,
  clearCart
} = ProductSlice.actions;
export default ProductSlice.reducer;