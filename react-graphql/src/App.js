import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/Main";
import Home from "./routes/Home/Home";
import { useCookies } from "react-cookie";

function App() {
    // const [datas, setDatas] = useState();
    const [isUserState, setUserState] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["reflashToken"]);

    let tokenUtill = {
        getAccessToken: async function () {
            return new Promise(async function (resolve, reject) {
                let accessToken;
                if (sessionStorage.getItem("accessToken") || cookies.reflashToken) {
                    if (sessionStorage.getItem("accessToken")) {
                        accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
                        if (tokenExpirationCheck(accessToken?.exp)) {
                            resolve(accessToken);
                        } else if (cookies.reflashToken) {
                            if (tokenExpirationCheck(cookies.reflashToken?.exp)) {
                                resolve(await tokenUtill.refreshToken(cookies.reflashToken?.signature));
                            } else {
                                setUserState(false)
                                resolve(false);
                            }
                        } else {
                            setUserState(false)
                            resolve(false);
                        }
                    } else if (cookies.reflashToken) {
                        if (tokenExpirationCheck(cookies.reflashToken?.exp)) {
                            resolve(await tokenUtill.refreshToken(cookies.reflashToken?.signature));
                        } else {
                            setUserState(false)
                            resolve(false);
                        }
                    }
                } else {
                    setUserState(false)
                    resolve(false);
                }
            });
        },
        refreshToken: async function (reflashToken) {
            let headers = { "Content-Type": "application/json", authorization: "Bearer " + reflashToken };
            let query = "mutation{getAccessToken{signature exp}}";
            let result = await this.simpleGraphqlAjax(query, headers);
            return result?.getAccessToken;
        },

        getUserInfo: async function (accessToken) {
            let headers = { "Content-Type": "application/json", authorization: "Bearer " + accessToken };
            let query = "mutation{getUserInfo{name}}";
            let result = await this.simpleGraphqlAjax(query, headers);

            return result?.getUserInfo;
        },

        userLogIn: async function (email, password) {
            let query =
                'mutation{ UserLogin(email :"' +
                email +
                '" , password :"' +
                password +
                '"){ accessToken{signature exp} refreshToken{signature exp}  }}';
            let result = await this.simpleGraphqlAjax(query);
          
            if (result?.UserLogin) {
                let tokens = result?.UserLogin;
                const sessionStorage = window.sessionStorage;
                sessionStorage.setItem("accessToken", JSON.stringify(tokens.accessToken));
                setCookie("reflashToken", tokens.refreshToken);

                fetchUser();
                return true;
            } else {
                //로그인 실패.
            }
        },

        userLogOut: function () {
            const sessionStorage = window.sessionStorage;
            sessionStorage.setItem("accessToken", null);
            setCookie("reflashToken", null);
            setUserState(false);
        },

        userSignUp: async function (email, password, name) {
            let headers = { "Content-Type": "application/json" };
            let query = 'mutation{UserSignUp(email:"' + email + '" name:"' + name + '" password:"' + password + '"){success message}}';
            let result = await this.simpleGraphqlAjax(query, headers);
            
            return await result;
        },

        setUserInfo: function (userInfo) {
        
            if (userInfo) {
                setUserState({
                    name: userInfo.name,
                });
            }
        },

        simpleGraphqlAjax :async function (query, headers = { "Content-Type": "application/json" }) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/graphql",
                    headers: headers,
                    data: JSON.stringify({ query: query }),
    
                    success: function (result) {
                        //작업이 성공적으로 발생했을 경우
                  
                        resolve(result.data);
                    },
                    error: function (e) {
                        resolve(e);
                    },
                });
            });
        }
    };

   
    function tokenExpirationCheck(exp) {
        if (parseInt(exp) > parseInt(new Date().getTime() + 30 * 1000)) {
            return true;
        } else {
            return false;
        }
    }
    async function fetchUser() {
        let accessToken = await tokenUtill.getAccessToken();

        if (await accessToken) {
            let userInfo = tokenUtill.getUserInfo(await accessToken?.signature);
            tokenUtill.setUserInfo(await userInfo);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Routes>
            <Route exact path="/" element={<MainLayout isUserState={isUserState} tokenUtill={tokenUtill} />}>
                <Route path="/" element={<Home name="Dddd" isUserState={isUserState}tokenUtill={tokenUtill}/>} />
                <Route path="/*" element={<Home tokenUtill={tokenUtill} />} />
            </Route>
        </Routes>
    );
}

export default App;
