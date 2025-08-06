import React, {useState,useEffect} from "react";
import {useParams } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/search.css"
import CardMovie from "../component/cardMovie";
import Pagination from "../component/pagination"
import LocalStorage from "../utils/localStorage";
import MoviesService from "../services/movies";

function Search () {
    const {t} = useTranslation();
    const {query} = useParams();
    const {isSearch} = useParams();
    const [data,setData] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
   
    useEffect(()=>{
        setIndexPage(1);
        if(isSearch==="1") MoviesService.searchMovie(query,LocalStorage.getLanguage(),1).then((x)=>{setData(x.results); setTotalPages(x.total_pages)});
        else MoviesService.filterMovie(query,LocalStorage.getLanguage(),1).then((x)=>{setData(x.results); setTotalPages(x.total_pages)});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query]);
    
    useEffect(()=>{
        if(indexPage===1) return;
        getData(query,LocalStorage.getLanguage(),indexPage);
    },[indexPage]);

    const getData = (query,language,page)=>{
        if(LocalStorage.getShowPagination()){
            if(isSearch==="1") MoviesService.searchMovie(query,language,page).then((x)=>{setData(x.results);});
            else MoviesService.filterMovie(query,language,page).then((x)=>{setData(x.results);});
        }
        else{
            if(isSearch==="1") MoviesService.searchMovie(query,language,page).then((x)=>{setData([...data,...x.results]);});
            else MoviesService.filterMovie(query,language,page).then((x)=>{setData([...data,...x.results]);});
        }
    }

    return (
        <div className="common-container">
            {isSearch==="1"&&<h2> {t("Search")}<span> {query} </span></h2>}
            {isSearch==="0"&&<h2> {t("Filter")} </h2>}
            {data!==null&&(data.length?<>
                <CardMovie method={"movie"} data={data}/>
                <Pagination totalPages={totalPages} indexPage={indexPage} setIndexPage={setIndexPage} showPagination={LocalStorage.getShowPagination()}/>
            </>:
            <div className="emptySearch">
                <img src="https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/search.png?v=1684402479948" alt="empty search"/>
                <h1> No results have been discovered! </h1>
            </div>
            )}
        </div>
    );
}
export default Search;