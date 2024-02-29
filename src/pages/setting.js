import React, {useState} from "react";
import "../style/setting.css"
import {useTranslation} from 'react-i18next';
import LocalStorage from "../function/localStorage.js";


function Setting(){
    const {t} = useTranslation();
    const [showPagination,setShowPagination] = useState(LocalStorage.getShowPagination());

    return(
        <div className="setting">
        <h1>{t("Setting")}</h1>
        <div className="pagination">
            <h3> {t("Show Pagination")} </h3>
            <input type="checkbox" id="paginationid" onClick={()=>{LocalStorage.setShowPagination(!showPagination);setShowPagination(!showPagination);}}  defaultChecked={showPagination}/><label htmlFor="paginationid"></label>
        </div>
        </div>
    )
}
export default Setting