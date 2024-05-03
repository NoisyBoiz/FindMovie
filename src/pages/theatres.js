import React, {useState,useEffect} from "react";
import {useTranslation} from 'react-i18next';
import CardMovie from "../component/cardMovie";
import Pagination from "../component/pagination"
import MoviesService from "../services/movies.js";
import LocalStorage from "../function/localStorage.js";
function Theatres () {
    const {t} = useTranslation();
    const [data,setData] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    
    useEffect(()=>{
        setIndexPage(1);
        MoviesService.getMovies("movie/now_playing",LocalStorage.getLanguage(),1).then((x)=>{setData(x.results);setTotalPages(x.total_pages);});
    },[LocalStorage.getLanguage()]);

    useEffect(()=>{
        console.log(indexPage);
        if(indexPage===1) return;
        if(LocalStorage.getShowPagination()) MoviesService.getMovies("movie/now_playing",LocalStorage.getLanguage(),indexPage).then((x)=>{setData(x.results);});
        else MoviesService.getMovies("movie/now_playing",LocalStorage.getLanguage(),indexPage).then((x)=>{setData([...data,...x.results]);});
    },[indexPage]);
   
    return (
        <div>
            <div className="common-container">
                <h2> {t("Theatres")} </h2>
                {data!==null&&<>
                    <CardMovie method={"movie"} data={data}/>
                    <Pagination totalPages={totalPages} indexPage={indexPage} setIndexPage={setIndexPage} showPagination={LocalStorage.getShowPagination()}/>
                </>
                }
            </div>
        </div>
    );
}
export default Theatres;