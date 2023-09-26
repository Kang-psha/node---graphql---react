import React from "react";

import Header from "./Header";

import { Outlet } from "react-router-dom";

const Main = ({ isUserState, tokenUtill }) => {

    return (
        <>
       
            <Header  isUserState = {isUserState} tokenUtill={tokenUtill}/>

            <Outlet />

        </>
    );
};

export default Main;
