import "./LoginModal.scss";
import $ from "jquery";
import { useCookies } from "react-cookie";
import { Dialog } from "primereact/dialog";

function Modal({ LModal, setLModal, tokenUtill }) {
    const [cookies, setCookie, removeCookie] = useCookies(["reflashToken"]);
    function tabClick(e) {
        e.preventDefault();
        $(e.target).addClass("active");
        $(e.target).siblings().removeClass("active");

        let target = "." + e.target.dataset.cont + "-area";

        $(".submit-button").text(e.target.dataset.cont);
        $(".submit-button").data("target", e.target.dataset.cont);
        $(target).siblings().hide();
        $(target).fadeIn(600);
    }

    async function userSubmit(e) {
        let target = $(e.target).data("target");
        if (target == "LogIn") {
            let uEmail = $("." + target + "-area")
                .find("input.u-email")
                .val();
            let uPass = $("." + target + "-area")
                .find("input.u-pass")
                .val();
            if (await tokenUtill.userLogIn(uEmail, uPass)) {
                console.log("xxsad");
                setLModal(false);
            } else {
                //로그인 실패
            }
        } else {
            let uEmail = $("." + target + "-area")
                .find("input.u-email")
                .val();
            let uPass = $("." + target + "-area")
                .find("input.u-pass")
                .val();

            let uName = $("." + target + "-area")
                .find("input.u-pass")
                .val();
            let result = await tokenUtill.userSignUp(uEmail, uPass, uName);
            if (await result?.UserSignUp) {
                if (result?.UserSignUp.success) {
                    if (await tokenUtill.userLogIn(uEmail, uPass)) {
                        console.log("xxsad");
                        setLModal(false);
                    } else {
                        //로그인 실패
                    }
                } else {
                    //회원가입 실패
                    console.log(result?.UserSignUp.message);
                }
            }
        }
    }

    return (
        <Dialog
            className="login-modal"
            visible={LModal}
            position={"top"}
            style={{ width: "400px" }}
            onHide={() => setLModal(false)}
            // footer={footerContent}
            draggable={false}
            resizable={false}
        >
            <div className="modal-content">
                <ul className="tab-group">
                    <li className="tab active" data-cont="LogIn" onClick={tabClick}>
                        로 그 인
                    </li>
                    <li className="tab" data-cont="SignUp" onClick={tabClick}>
                        회원가입
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="filed LogIn-area">
                        <div className="field-wrap">
                            <input className="u-email" type="text" required="required" autoComplete="off" />
                            <label>email</label>
                        </div>
                        <div className="field-wrap">
                            <input className="u-pass" type="text" required="required" autoComplete="off" />
                            <label>password</label>
                        </div>
                    </div>
                    <div className="filed SignUp-area" style={{ display: "none" }}>
                        <div className="field-wrap">
                            <input className="u-email" type="text" required="required" autoComplete="off" />
                            <label>email</label>
                        </div>
                        <div className="field-wrap">
                            <input className="u-pass" type="text" required="required" autoComplete="off" />
                            <label>password</label>
                        </div>
                        <div className="field-wrap">
                            <input className="u-name" type="text" required="required" autoComplete="off" />
                            <label>name</label>
                        </div>
                    </div>
                </div>
                <button type="submit" data-target="LogIn" className="button submit-button" onClick={userSubmit}>
                    LogIn
                </button>
            </div>
        </Dialog>
    );
}

export default Modal;
