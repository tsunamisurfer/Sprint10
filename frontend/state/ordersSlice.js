import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load saved orders from localStorage
const loadOrdersFromStorage = () => {
  try {
    const savedOrders = localStorage.getItem('pizzaOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
    return [];
  }
};

// Save orders to localStorage
const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem('pizzaOrders', JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

// Fetch orders from the server
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await fetch('http://localhost:9009/api/pizza/history'); // ✅ Ensure this endpoint is correct
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const serverOrders = await response.json();
  console.log("Orders fetched successfully:", serverOrders); // 🔥 Debugging

  // Merge server orders with localStorage orders to avoid data loss
  const localOrders = loadOrdersFromStorage();
  const mergedOrders = [...serverOrders, ...localOrders];

  saveOrdersToStorage(mergedOrders); // ✅ Ensure merged orders are saved
  return mergedOrders;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: loadOrdersFromStorage(), // ✅ Load saved orders when the app starts
    loading: false,
    error: null,
  },
  reducers: {
    setOrder(state, action) {
      console.log("Saving new order in Redux:", action.payload); // 🔥 Debugging
      state.orders.push(action.payload); // ✅ Update Redux
      saveOrdersToStorage(state.orders); // ✅ Persist new order in localStorage
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching orders...");
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Orders merged and loaded successfully:", action.payload); // 🔥 Debugging
        state.orders = action.payload; // ✅ Ensure orders are updated
        saveOrdersToStorage(state.orders); // ✅ Persist merged orders
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Error fetching orders:", action.error.message);
      });
  },
});

export const { setOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

