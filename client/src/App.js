import React from "react";
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import singleReducer from "./store/reducer/user";
import multiReducer from "./store/reducer/users";
import Home from "./Page/Home/Home";
import Search from "./Page/Search/Search";
import UserPage from "./Page/User/User" 
import UsersPage from "./Page/User-VS-User/Users" 


const App = () => {
  const rootReducer = combineReducers({
    singleUser: singleReducer,
    multiUsers: multiReducer,
  });

  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:type" element={<Search/>} />
        <Route path="/user/:type" element={<UserPage/>} />
        <Route path="/users/:type" element={<UsersPage/>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
