import React, { useRef, useEffect, useState } from "react";
import "./post-write.scss";
import $ from "jquery";
import { useCookies } from "react-cookie";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";

function Modal({ PMModal, setPMModal, postViewData, tokenUtill }) {
    const [cookies, setCookie, removeCookie] = useCookies(["reflashToken"]);
    const [PostId, setPostId] = useState(0);
    const [TitleText, setTitleText] = useState("");
    const [descText, setdescText] = useState("");
    const [FileArr, setFileArr] = useState([]);

    const fileUploadRef = useRef(null);

    function setText() {
        let data = JSON.parse(postViewData);
        setPostId(data.id);
        setTitleText(data.title);
        setdescText(data.desc);
        setFileArr(data.files);
    }
    async function postModifySubmit(e) {
        let accessToken = await tokenUtill.getAccessToken();
        let attachment = fileUploadRef.current.getFiles();

        let postformData = new FormData();

        // console.log(fileUploadRef.Fi)

        let desc = descText;

        postformData.append(
            "operations",
            JSON.stringify({
                query: "mutation ($files: [Upload] ,$title: String! , $desc:String! , $postId:ID!) { PostModify(files: $files , title : $title , desc: $desc , id: $postId ) }",
            })
        );

        let filemap = {};

        for (let j = 0; j < attachment.length; j++) {
            postformData.append(j, attachment[j]);
            filemap[j] = ["variables.files." + j];
        }

        filemap.title = ["variables.title"];
        postformData.append("title", TitleText);
        console.log(PostId);
        filemap.postId = ["variables.postId"];
        postformData.append("postId", parseInt(PostId));

        filemap.desc = ["variables.desc"];
        postformData.append("desc", desc);

        postformData.append("map", JSON.stringify(filemap));
        if (await accessToken) {
            let headers = {authorization: "Bearer " + (await accessToken.signature) };
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/graphql",
                data: postformData,
                headers : headers, 
                contentType: false,
                processData: false,
                success: function (result) {
                    //작업이 성공적으로 발생했을 경우
                    // setEditorText(newtext)
                    setPMModal(false);
                },
                error: function (e) {
                    console.log(e);
                },
            });
        } else {
            alert("토큰 없음")
        }
    }
    async function loadFiles(postid, files) {
        return new Promise(async function (resolve, reject) {
            if (files) {
                let fileArr = [];
                for (let i = 0; i < files.length; i++) {
                    // fileArr.push(newFile);
                    fileArr[i] = new Promise(async function (resolve, reject) {
                        fetch("/postFile/" + postid + "/" + files[i])
                            .then((response) => response.blob())
                            .then((blob) => {
                                let newFile = new File([blob], files[i], { type: blob.mimetype });
                                resolve(newFile);
                            });
                    });
                }
                Promise.all(fileArr).then((values) => {
                    resolve(values);
                });
            }
        });
    }
    // (file) => )
    useEffect(() => {
        setText();
    }, [postViewData]);

    useEffect(() => {
        let data = JSON.parse(postViewData);
        setTimeout(async function () {
            if (fileUploadRef.current) {
                fileUploadRef.current.setFiles(await loadFiles(data.id, data.files));
            }
        }, 0);
    }, [PMModal]);

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
            className="post-modify-modal"
            visible={PMModal}
            position={"top"}
            style={{ width: "600px" }}
            onHide={() => setPMModal(false)}
            draggable={false}
            resizable={false}
            header={TitleText}
        >
            <InputText placeholder="제목" value={TitleText} onChange={(e) => setTitleText(e.target.value)} />
            <Editor value={descText} onTextChange={(e) => setdescText(e.htmlValue)} style={{ height: "80%" }} />
            <FileUpload
                ref={fileUploadRef}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                multiple
                accept="*"
                customUpload
                setfiles={["ddd"]}
                emptyTemplate={<p className="drag-msg">파일을 여기로 드래그 앤 드롭하여 업로드하세요.</p>}
            />
            <div className="button-fied">
                <Button type="submit" severity="danger" className="button cancle-button" onClick={() => setPMModal(false)}>
                    취소
                </Button>
                <Button type="submit" severity="warning" className="button submit-button" onClick={postModifySubmit}>
                    수정
                </Button>
            </div>
        </Dialog>
    );
}

export default Modal;
