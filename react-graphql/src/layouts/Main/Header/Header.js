import { useState } from "react";
import "./Header.scss";
import LoginModal from "./Modal/LoginModal";


function Header({ isUserState, tokenUtill }) {
    function loginCheck() {
        if (isUserState) {
            return (
                <>
                    {isUserState.name} <button onClick={tokenUtill.userLogOut}>로그아웃</button>
                </>
            );
        } else {
            return (
                <button className="login-btn" onClick={showLMadol}>
                    로그인
                </button>
            );
        }
    }
    const [LModal, setLModal] = useState(false);
    const showLMadol = () => {
        setLModal(true);
    };

    return (
        <>
            <div className="navbar">{loginCheck()}</div>
            <LoginModal LModal={LModal} setLModal={setLModal} tokenUtill={tokenUtill}></LoginModal>
        </>
    );
}

export default Header;
