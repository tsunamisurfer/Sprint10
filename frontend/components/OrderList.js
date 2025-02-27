import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSizeFilter } from '../state/sizeFilterSlice';
import { fetchOrders } from '../state/ordersSlice';

export default function OrderList() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const sizeFilter = useSelector((state) => state.sizeFilter);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleFilterClick = (size) => {
    dispatch(setSizeFilter(size));
  };

  const filterOrders = orders.filter((order) => sizeFilter === 'All' || order.size === sizeFilter);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>

      {loading && <p data-testid="loadingMessage">Loading orders...</p>}
      {error && <p>Error loading orders: {error}</p>}
      {filterOrders.length === 0 && !loading && <p>No orders available.</p>}

      <ol>
        {filterOrders.map((order, index) => {
          // Use `customer`, fallback to "Unknown Customer" if missing
          const customerName = order.customer || "Unknown Customer";
          
          const toppingCount = order.toppings ? order.toppings.length : 0;
          const toppingText = toppingCount === 0 
            ? "with no toppings" 
            : `with ${toppingCount} topping${toppingCount > 1 ? "s" : ""}`;

          // Ensure the key is unique based on order's properties
          const key = order.id ?? `${customerName}-${order.size}-${toppingCount}-${index}`;

          return (
            <li key={key} data-testid={`order-${order.id ?? index}`}>
              <p>{customerName} ordered a size {order.size} {toppingText}</p>
            </li>
          );
        })}
      </ol>

      <div id="sizeFilters">
        <p>Filter by size:</p>
        {['All', 'S', 'M', 'L'].map((size) => (
          <button
            data-testid={`filterBtn${size}`}
            className={`button-filter${size === sizeFilter ? ' active' : ''}`}
            key={size}
            onClick={() => handleFilterClick(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}