import React, { useRef, useState } from "react";
import "./post-write.scss";
import $ from "jquery";
import { useCookies } from "react-cookie";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

function Modal({ PWModal, setPWModal, tokenUtill }) {
    const [cookies, setCookie, removeCookie] = useCookies(["reflashToken"]);
    const [EditorText, setEditorText] = useState("");
    const [TitleText, setTitleText] = useState("");

    const fileUploadRef = useRef(null);
    async function postWriteSubmit(e) {
        
        let accessToken = await tokenUtill.getAccessToken();

        let attachment = fileUploadRef.current.getFiles();
        let postformData = new FormData();

        let desc = EditorText;

        postformData.append(
            "operations",
            JSON.stringify({
                query: "mutation ($files: [Upload] ,$title: String! , $desc:String!) { PostUpload(files: $files , title : $title , desc: $desc ) }",
            })
        );

        let filemap = {};

        for (let j = 0; j < attachment.length; j++) {
            postformData.append(j, attachment[j]);
            filemap[j] = ["variables.files." + j];
        }

        filemap.title = ["variables.title"];
        postformData.append("title", TitleText);

        filemap.desc = ["variables.desc"];
        postformData.append("desc", desc);

        postformData.append("map", JSON.stringify(filemap));
       

        if(await accessToken){
            let headers = {authorization: "Bearer " + (await accessToken.signature) };
            console.log(headers)
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/graphql",
                headers : headers,
                data: postformData,
                contentType: false,
                processData: false,
                success: function (result) {
                    //작업이 성공적으로 발생했을 경우
                    // setEditorText(newtext)

                    setPWModal(false)
                },
                error: function (e) {
                    console.log(e);
                },
            });
        }else{
            alert("토큰 없음")
        }
       
    }

    const chooseOptions = {
        icon: "pi pi-fw pi-file",
        iconOnly: true,
        className: "custom-choose-btn p-button-rounded p-button-outlined",
    };

    const uploadOptions = {
        className: "custom-none-btn",
    };

    const cancelOptions = {
        icon: "pi pi-fw pi-times",
        iconOnly: true,
        className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
    };

    return (
        <Dialog
            className="post-write-modal"
            visible={PWModal}
            position={"top"}
            style={{ width: "600px" }}
            onHide={() => setPWModal(false)}
            // footer={footerContent}
            draggable={false}
            resizable={false}
        >
            {/* <img src={process.env.PUBLIC_URL + '/ufile/BieSYsRHCB9QQKsXEGUS.jpeg' }></img> */}
            <Tooltip target=".custom-choose-btn" content="File Select" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Delete All" position="bottom" />

            <div className="post-write-field">
                <InputText placeholder="제목" value={TitleText} onChange={(e) => setTitleText(e.target.value)} />
                <Editor value={EditorText} onTextChange={(e) => setEditorText(e.htmlValue)} style={{ height: "80%" }} />

                <FileUpload
                    ref={fileUploadRef}
                    chooseOptions={chooseOptions}
                    uploadOptions={uploadOptions}
                    cancelOptions={cancelOptions}
                    multiple
                    accept="*"
                    customUpload
                    // uploadHandler={customBase64Uploader}
                    emptyTemplate={<p className="">파일을 여기로 드래그 앤 드롭하여 업로드하세요.</p>}
                />
            </div>
            <div className="button-fied">
                <Button type="submit" data-target="LogIn" severity="danger" className="button cancle-button" onClick={() => setPWModal(false)}>
                    취소
                </Button>
                <Button type="submit" data-target="LogIn" className="button submit-button" onClick={postWriteSubmit}>
                    작성
                </Button>
            </div>
        </Dialog>
    );
}

export default Modal;
