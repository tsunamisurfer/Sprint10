import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// #### Endpoint A: [GET] `http://localhost:9009/api/pizza/history`

// This endpoint allows you to GET the list of past orders from the server.

// #### Endpoint B: [POST] `http://localhost:9009/api/pizza/order`

// This endpoint allows you to POST a new pizza order. Here is an example of a valid request payload:

// ```json
// { "fullName": "Jane Doe", "size": "L", "toppings": ["1","2","3","4","5"] }

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9009/api" }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getPizzaHistory: builder.query({
      query: () => "/pizza/history",
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/pizza/order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetPizzaHistoryQuery, useCreateOrderMutation } = pizzaApi;

