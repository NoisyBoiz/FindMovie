import React, {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/tvShows.css"
import CardMovie from "../component/cardMovie.jsx";
import Pagination from "../component/pagination.jsx"
import MoviesService from "../services/movies.jsx";
import LocalStorage from "../utils/localStorage.jsx";

function TVShows () {
    const {t} = useTranslation();
    const {method} = useParams();

    const [data,setData] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);

    useEffect(()=>{
        setIndexPage(1);
        MoviesService.getTV(method,LocalStorage.getLanguage(),1).then((x)=>{setData(x.results);setTotalPages(x.total_pages);});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[LocalStorage.getLanguage(),method]); 
    useEffect(()=>{
        if(indexPage===1) return;
        if(LocalStorage.getShowPagination()) MoviesService.getTV(method,LocalStorage.getLanguage(),indexPage).then((x)=>{setData(x.results);});
        else MoviesService.getTV(method,LocalStorage.getLanguage(),indexPage).then((x)=>{setData([...data,...x.results]);});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexPage]);

    return (
        <div>
            <div className="common-container">
                <h2> {t("TV Shows")} <span>{method==="popular"?t("Popular"):method==="topRate"?t("Top Rated"):method==="airingToday"?t("Airing Today"):t("On The Air")} </span> </h2>
                {data!=null&&<>
                    <CardMovie method={"tv"} data={data}/>
                    <Pagination totalPages={totalPages} indexPage={indexPage} setIndexPage={setIndexPage} showPagination={LocalStorage.getShowPagination()}/>
                </>}
            </div>
        </div>
    );
}
export default TVShows;