import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setOrder } from '../state/ordersSlice';

const initialFormState = {
  fullName: '',
  size: '',
  toppings: [],
};

export default function PizzaForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setFormState((prevState) => ({
        ...prevState,
        toppings: checked
          ? [...prevState.toppings, name]
          : prevState.toppings.filter((topping) => topping !== name),
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

     if (!formState.fullName.trim() || formState.fullName.length < 3 || formState.fullName.length > 20) {
      setIsPending(false);
      setError("fullName is required");
      return;
 
    }
    if (!["S", "M", "L"].includes(formState.size)) {
      setIsPending(false);
      setError("size must be one of the following values: S, M, L");
      return;
   
    }

    const order = {
      fullName: formState.fullName,
      size: formState.size,
      toppings: formState.toppings.length > 0 ? formState.toppings : [],
    };

    try {
      const response = await fetch('http://localhost:9009/api/pizza/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsPending(false);
        setError(errorData.message);
        return;
      }

      setFormState(initialFormState);
      setIsPending(false);
      dispatch(setOrder(order));
    } catch (err) {
      setIsPending(false);
      setError('An error occurred while submitting your order.');
    }
  };

  return (
    <div>
      <h2>Pizza Form</h2>
      <form onSubmit={handleSubmit}>
        {isPending && <div data-testid="pendingMessage" className="pending">Order in progress...</div>}
        {error && <div data-testid="validationMessage" className="failure">{error}</div>}

        <div className="input-group">
          <label htmlFor="fullName">Full Name</label><br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={formState.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="size">Size</label><br />
          <select
            data-testid="sizeSelect"
            id="size"
            name="size"
            value={formState.size}
            onChange={handleChange}
          >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>

        <div className="input-group">
          <label>
            <input data-testid="checkPepperoni" name="1" type="checkbox" checked={formState.toppings.includes("1")} onChange={handleChange} />
            Pepperoni
          </label>
          <label>
            <input data-testid="checkGreenpeppers" name="2" type="checkbox" checked={formState.toppings.includes("2")} onChange={handleChange} />
            Green Peppers
          </label>
          <label>
            <input data-testid="checkPineapple" name="3" type="checkbox" checked={formState.toppings.includes("3")} onChange={handleChange} />
            Pineapple
          </label>
          <label>
            <input data-testid="checkMushrooms" name="4" type="checkbox" checked={formState.toppings.includes("4")} onChange={handleChange} />
            Mushrooms
          </label>
          <label>
            <input data-testid="checkHam" name="5" type="checkbox" checked={formState.toppings.includes("5")} onChange={handleChange} />
            Ham
          </label>
        </div>

        <input data-testid="submit" type="submit" value="Submit Order" />
      </form>
    </div>
  );
}
