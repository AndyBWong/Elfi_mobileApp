import { configureStore, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { SecureSave } from "../components/functions";
// ---------------------------------------------
const searchResultSlice = createSlice({
  name: "searchResult",
  initialState: {},
  reducers: {
    newResult: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
export const { newResult } = searchResultSlice.actions;

// ---------------------------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
      let product = state.find((p) => p._id === action.payload.product._id);
      if (product !== undefined) {
        product.qte += action.payload.qte;
      } else {
        let newProduct = action.payload.product;
        state.push(newProduct);
      }
    },
    deleteProduct: (state, action) => {
      state = state.filter((p) => p._id !== action.payload);
      return state;
    },
    modifyProduct: (state, action) => {
      let product = state.find((p) => p._id === action.payload._id);
      product.qte = action.payload.qte;
    },
    dropCart: (state) => {
      state = [];
      return state;
    },
  },
});
export const { addProduct, deleteProduct, modifyProduct, dropCart } = cartSlice.actions;

// ---------------------------------------------
const userInvSlice = createSlice({
  name: "userInv",
  initialState: [],
  reducers: {
    deleteProductInv: (state, action) => {
      state = state.filter((p) => p._id !== action.payload);
      return state;
    },
    modifyProductInv: (state, action) => {
      let product = state.find((p) => p._id === action.payload._id);
      product.qte = action.payload.qte;
    },
    invResult: (state, action) => {
      state = action.payload;
      return state;
    }
  },
});
export const {invResult, deleteProductInv, modifyProductInv } = userInvSlice.actions;

// -------------------------------------------------
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    mail: "",
    pseudo: "",
    invId: "",
    isConnected: false,
  },
  reducers: {
    logIn: (state, action) => {
      state = {
        mail: action.payload.mail,
        pseudo: action.payload.pseudo,
        isConnected: action.payload.isConnected,
        invId: action.payload.invId,
      };
      return state;
    },
    logOut: (state) => {
      SecureSave("mail", "");
      SecureSave("pwd", "");
      state =  {
        mail: "",
        pseudo: "",
        isConnected: false,
      };
      return state;
    },
  },
});
export const { logIn, logOut } = userInfoSlice.actions;

const reload = createSlice({
  name:"reload",
  initialState: false,
  reducers: {
    reloading: (state)=>{
      if(state){
        state = false
      }else{
        state = true
      }
      return state
    }
  }
})
export const {reloading} = reload.actions;
// -------------------------------------------------
export const store = configureStore({
  reducer: {
    searchResultReducer: searchResultSlice.reducer,
    cartReducer: cartSlice.reducer,
    userInvReducer: userInvSlice.reducer,
    userInfoReducer: userInfoSlice.reducer,
    reloadReducer : reload.reducer
  },
});
