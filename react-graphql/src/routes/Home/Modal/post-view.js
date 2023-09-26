import React, { useRef, useEffect, useState } from "react";
import "./post-write.scss";
import $ from "jquery";
import { useCookies } from "react-cookie";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";

function Modal({ PVModal, setPVModal, postViewData }) {
    const [cookies, setCookie, removeCookie] = useCookies(["reflashToken"]);
    const [PostId, setPostId] = useState(0);
    const [TitleText, setTitleText] = useState("");
    const [descText, setdescText] = useState("");
    const [FileArr, setFileArr] = useState([]);

    function setText() {
        let data = JSON.parse(postViewData);
        setPostId(data.id);
        setTitleText(data.title);
        setdescText(data.desc);
        setFileArr(data.files);
    }
    function emptyFileArr(){
        console.log(FileArr)
        if (FileArr) {
            if(FileArr.length > 0){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }
    let fileList = function () {
        let fileList = [];
        console.log(FileArr);
        if (FileArr) {
            for (let i = 0; i < FileArr.length; i++) {
                fileList.push(
                    <div className="filewrap" key ={i}>
                        <div className="fileName" >{FileArr[i]}</div> <Button onClick={function(){onClickImgLink(PostId , FileArr[i])}}>다운로드</Button>
                    </div>
                );
            }
        }
        return fileList;
    };

    const onClickImgLink = function(postid, name) {
        let srcUrl = "/postFile/" + postid + "/" + name
        fetch(srcUrl, { method: 'GET' }).then((res) => res.blob()).then((blob) => {
           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
           a.href = url;
           a.download = name;
           document.body.appendChild(a);
           a.click();
           setTimeout((_) => {
           window.URL.revokeObjectURL(url);
           }, 1000);
           a.remove();
        }).catch((err) => {
           console.error('err', err);
        });
     };


    // (file) => )
    useEffect(() => {
        setText();
    }, [postViewData]);
    return (
        <Dialog
            className="post-view-modal"
            visible={PVModal}
            position={"top"}
            style={{ width: "600px" }}
            onHide={() => setPVModal(false)}
            draggable={false}
            resizable={false}
            header={TitleText}
        >
            <Editor value={descText} style={{ height: "100%" }} readOnly />
            <div className="fileList-area" style={emptyFileArr() ? { display: "block" } : { display: "none" }}>
                {fileList()}
            </div>
            <div className="button-fied">
                {/* <Button type="submit" data-target="LogIn" className="button submit-button" z>
                    닫기
                </Button> */}
            </div>
        </Dialog>
    );
}

export default Modal;
