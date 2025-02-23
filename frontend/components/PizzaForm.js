import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setOrder } from '../state/ordersSlice'; // Correct import of the setOrder action

const initialFormState = {
  fullName: '',
  size: '',
  '1': false,  
  '2': false,  
  '3': false,  
  '4': false,  
  '5': false,  
};

export default function PizzaForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [isPending, setIsPending] = useState(false); 
  const [error, setError] = useState(null); 
  const dispatch = useDispatch(); 

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

   
    if (formState.fullName.length < 3 || formState.fullName.length > 20) {
      setIsPending(false);
      setError('fullName is required');
      return;
    }

   
    const order = {
      fullName: formState.fullName,
      size: formState.size,
      toppings: Object.keys(formState).filter((key) => formState[key] && key !== 'fullName' && key !== 'size'),
    };

    try {
      const response = await fetch('http://localhost:9009/api/pizza/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
      
        setFormState(initialFormState);
        setIsPending(false);
        dispatch(setOrder(order)); 
      } else {
        const errorData = await response.json();
        setIsPending(false);
        setError(errorData.message); 
      }
    } catch (err) {
      setIsPending(false);
      setError('An error occurred while submitting your order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      {isPending && <div className="pending">Order in progress...</div>}
      {error && <div className="failure">Order failed: {error}</div>}

      <div className="input-group">
        <div>
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
      </div>

      <div className="input-group">
        <div>
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
      </div>

      <div className="input-group">
        <label>
          <input
            data-testid="checkPepperoni"
            name="1"
            type="checkbox"
            checked={formState['1']}
            onChange={handleChange}
          />
          Pepperoni<br />
        </label>
        <label>
          <input
            data-testid="checkGreenpeppers"
            name="2"
            type="checkbox"
            checked={formState['2']}
            onChange={handleChange}
          />
          Green Peppers<br />
        </label>
        <label>
          <input
            data-testid="checkPineapple"
            name="3"
            type="checkbox"
            checked={formState['3']}
            onChange={handleChange}
          />
          Pineapple<br />
        </label>
        <label>
          <input
            data-testid="checkMushrooms"
            name="4"
            type="checkbox"
            checked={formState['4']}
            onChange={handleChange}
          />
          Mushrooms<br />
        </label>
        <label>
          <input
            data-testid="checkHam"
            name="5"
            type="checkbox"
            checked={formState['5']}
            onChange={handleChange}
          />
          Ham<br />
        </label>
      </div>

      <input data-testid="submit" type="submit" value="Submit Order" />
    </form>
  );
}
