import {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import { Link } from "react-router-dom";
import CardMovie from "../component/cardMovie.jsx";
import Pagination from "../component/pagination.jsx"
import LocalStorage from "../utils/localStorage.jsx";
import "../style/collections.css"

function Collections(){
    const {t} = useTranslation();
    const [allData, setAllData] = useState(null);
    const [data,setData] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const [cardPerPage] = useState(20);

    useEffect(()=>{ 
        setIndexPage(1);
        let getDataFavorite = LocalStorage.getFavorite();
        setAllData(getDataFavorite);
        setTotalPages(Math.ceil(getDataFavorite.length/cardPerPage));
        setData(getDataFavorite.slice(0,cardPerPage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(()=>{
        if(indexPage===1) return;
        if(LocalStorage.getShowPagination()) setData(allData.slice((indexPage-1)*cardPerPage,indexPage*cardPerPage));
        else setData(allData.slice(0,indexPage*cardPerPage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexPage]);

    return(
        <>
        <div className="common-container">
            {data!=null&&data.length?<>
                <h2> {t("Collections")} </h2>
                <CardMovie method={"favorite"} data={data}/> 
                {totalPages>1&&<Pagination totalPages={totalPages} indexPage={indexPage} setIndexPage={setIndexPage} showPagination={LocalStorage.getShowPagination()}/>}
            </>:
            <div className="emptyCollections"> 
                <img src="https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/box.png?v=1684402478245" alt="empty collections"/>
                <h1> There is no data in the collection right now! </h1>
                <h1> Let's explore more </h1>
                <Link to="/"> Back to home </Link>
            </div>
            }       
        </div>
        </>
    )
}
export default Collections;