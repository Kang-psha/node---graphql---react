import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PostWriteModal from "./Modal/post-write";
import PostViewModal from "./Modal/post-view";
import PostModifyModal from "./Modal/post-modify";
import { Dropdown } from "primereact/dropdown";

import $, { event } from "jquery";
import "./Home.scss";

function Home({ isUserState, tokenUtill }) {
    const [customers, setCustomers] = useState([]);
    const [PWModal, setPWModal] = useState(false);
    const [PVModal, setPVModal] = useState(false);
    const [PMModal, setPMModal] = useState(false);
    const [pagevalue, setpagevalue] = useState({ name: 5, code: 5 });
    const [postViewData, setpostViewData] = useState(JSON.stringify({ title: "", desc: "", file: [] }));

    const showPostWriteModal = () => {
        setPWModal(true);
    };

    const showPostViewModal = () => {
        setPVModal(true);
    };

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

    async function loadPostList() {
        let headers;
        let accessToken = await tokenUtill.getAccessToken();

        if (await accessToken) {
            headers = { "Content-Type": "application/json", authorization: "Bearer " + (await accessToken.signature) };
        }
        let query = "mutation{ PostList { id title desc files authority date userName}}";
        let result = await tokenUtill.simpleGraphqlAjax(query, headers);
        setCustomers(result?.PostList);
    }
    const pageval = [
        { name: 5, code: 5 },
        { name: 10, code: 10 },
        { name: 25, code: 25 },
        { name: 50, code: 50 },
        
        
    ];
    function talbleHeader() {
        if (isUserState) {
            return (
                <>
                    <Dropdown value={pagevalue} onChange={(e) => setpagevalue(e.value)} options={pageval} optionLabel="name" />

                    <div className="post-table-header">
                        <Button type="button" onClick={showPostWriteModal} raised>
                            게시글 작성
                        </Button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <Dropdown value={pagevalue} onChange={(e) => setpagevalue(e.value)} options={pageval} optionLabel="name" />
                    <div className="post-table-header">
                        <Button type="button" disabled raised>
                            게시글 작성
                        </Button>
                    </div>
                </>
            );
        }
    }

    useEffect(() => {
        loadPostList();
    }, [isUserState, PWModal, PVModal, PMModal]);

    function tableRowSelect(e) {
        setpostViewData(JSON.stringify(e.data));
        showPostViewModal(true);
    }
    function PostModifySelect(data) {
       
        setpostViewData(JSON.stringify(data));
        setPMModal(true);
        return false;
    }

    async function PostDeleteSelect(data) {
       
        if (window.confirm("삭제 메세지")) {
            let headers;
            let accessToken = await tokenUtill.getAccessToken();

            if (await accessToken) {
                headers = { "Content-Type": "application/json", authorization: "Bearer " + (await accessToken.signature) };

                let query = "mutation{ PostDelete(id:" + data.id + ") }";
                let result = await tokenUtill.simpleGraphqlAjax(query, headers);
                loadPostList();
            }
        }
        return false;
    }

    const bodytem = function (rowData) {
        if (rowData.authority) {
            return (
                <div>
                    <button
                        severity="warning"
                        onClick={function () {
                            PostModifySelect(rowData);
                        }}
                        className="post-modify-bnt"
                        raised
                    >
                        <img src="/img/icon-edit-button.png"></img>
                    </button>
                    <button
                        severity="danger"
                        className="post-delete-bnt"
                        onClick={function () {
                            PostDeleteSelect(rowData);
                        }}
                        raised
                    >
                        <img src="/img/icon-trash-can.png"></img>
                    </button>
                </div>
            );
        } else {
            return "";
        }
    };
    return (
        <>
            <PostWriteModal PWModal={PWModal} setPWModal={setPWModal} tokenUtill={tokenUtill}></PostWriteModal>
            <PostViewModal PVModal={PVModal} setPVModal={setPVModal} postViewData={postViewData}></PostViewModal>
            <PostModifyModal PMModal={PMModal} setPMModal={setPMModal} postViewData={postViewData} tokenUtill={tokenUtill}></PostModifyModal>
            <div className="card">
                <DataTable
                    header={talbleHeader}
                    value={customers}
                    paginator
                    rows={pagevalue.name}
                    // rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    selectionMode="single"
                    onRowSelect={tableRowSelect}
                >
                    <Column field="title" header="제목" style={{ width: "25%" }}></Column>
                    {/* <Column field="desc" header="내용" style={{ width: "40%" }}></Column> */}
                    <Column field="userName" header="작성자" style={{ width: "10%" }}></Column>
                    <Column field="date" header="날짜" style={{ width: "15%" }}></Column>
                    <Column field="" header="" body={bodytem} style={{ width: "10%" }}></Column>
                </DataTable>
            </div>
        </>
    );
}

export default Home;
