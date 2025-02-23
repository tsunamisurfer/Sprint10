import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSizeFilter } from '../state/sizeFilterSlice';

export default function OrderList() {
  const initialState = [];
  const orders = useSelector((state) => state.orders.orders) || [];
  const sizeFilter = useSelector((state) => state.sizeFilter);
  const dispatch = useDispatch();

  console.log('Redux orders state:', orders); // Debugging Redux state
  console.log('Current size filter:', sizeFilter);

  const handleFilterClick = (size) => {
    dispatch(setSizeFilter(size));
  };

  const filterOrders = (Array.isArray(orders) ? orders : []).filter((order) => {
  return sizeFilter === 'All' || order.size === sizeFilter;
  });

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {filterOrders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ol>
          {filterOrders.map((order, index) => (
            <li key={index}>
              <div>
                <p>Order for: {order.fullName}</p>
                <p>Toppings: {order.toppings.join(', ')}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div id="sizeFilters">
        <p>Filter by size:</p>
        {['All', 'S', 'M', 'L'].map((size) => {
          const className = `button-filter${size === sizeFilter ? ' active' : ''}`;
          return (
            <button
              data-testid={`filterBtn${size}`}
              className={className}
              key={size}
              onClick={() => handleFilterClick(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
