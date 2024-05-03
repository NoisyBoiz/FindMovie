import React, {useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/navbar.css"

function Navbar(){
    const {t} = useTranslation();
    const [showMenuTVShow, setShowMenuTVShow] = useState(false);
    const [focusNavbar, setFocusNavbar] = useState("home");
    const getPath = ()=>{
        let arr = window.location.pathname.split("/");
        if(arr[1]==="") setFocusNavbar("home");
        else if(arr[1]==="tvshows") setFocusNavbar(arr[2]);
        else setFocusNavbar(arr[1]);
    }
    useEffect(()=>{getPath();},[]);
    const handleLogout = ()=>{
        localStorage.removeItem("user-info");
        window.location.reload();
    }
    return(
        <div className="navbar">
            <div className="navbarMenu">
                <ul> 
                    <Link to="/"> <li className={focusNavbar==="home"?"focusNavbar":"unfocusNavbar"} onClick={()=>{setFocusNavbar("home")}}> <i className="fa-solid fa-house"></i>{t("Home")} </li> </Link>
                    <Link to="/theatres"><li className={focusNavbar==="theatres"?"focusNavbar":"unfocusNavbar"} onClick={()=>{setFocusNavbar("theatres")}} ><i className="fa-solid fa-ticket"></i>{t("Theatres")}</li></Link>
                    <li className={`menuTVShow ${(focusNavbar==="popular"||focusNavbar==="topRate"||focusNavbar==="airingToday"||focusNavbar==="onTheAir")?"focusNavbar":"unfocusNavbar"}`} onMouseMove={()=>{setShowMenuTVShow(true)}} onMouseLeave={()=>{setShowMenuTVShow(false)}}>
                        <span> <i className="fa-solid fa-tower-cell"></i>{t("TV Shows")} <i className="fa-solid fa-angle-down"></i></span>
                        <ul className={showMenuTVShow?"showMenuTVShow":"hiddenMenuTVShow"} >
                            <Link to="/tvshows/popular"><li className={focusNavbar==="popular"?"focusTVShowLi":"unfocusTVShowLi"} onClick={()=>{setFocusNavbar("popular")}} >{t("Popular")}</li></Link>
                            <Link to="/tvshows/top_rated"><li className={focusNavbar==="topRate"?"focusTVShowLi":"unfocusTVShowLi"} onClick={()=>{setFocusNavbar("topRate")}}>{t("Top Rated")}</li></Link>
                            <Link to="/tvshows/airing_today"><li className={focusNavbar==="airingToday"?"focusTVShowLi":"unfocusTVShowLi"} onClick={()=>{setFocusNavbar("airingToday")}}>{t("Airing Today")}</li></Link>
                            <Link to="/tvshows/on_the_air"><li className={focusNavbar==="onTheAir"?"focusTVShowLi":"unfocusTVShowLi"} onClick={()=>{setFocusNavbar("onTheAir")}}>{t("On The Air")}</li></Link>
                        </ul>
                    </li>
                    <Link to="/collections"><li className={focusNavbar==="collections"?"focusNavbar":"unfocusNavbar"} onClick={()=>{setFocusNavbar("collections")}}><i className="fa-solid fa-inbox"></i>{t("Collections")}</li></Link>
                </ul>
            </div>
            <div className="navbarSetting">
                <ul>
                    <Link to="/setting">  <li className={focusNavbar==="setting"?"focusNavbar":"unfocusNavbar"} onClick={()=>{setFocusNavbar("setting")}}><i className="fa-solid fa-gear" ></i>{t("Setting")}</li></Link>
                    <li> <i className="fa-solid fa-circle-info"></i>{t("Help")}</li>
                </ul>
            </div>
            <div className="logOut" onClick={()=>{handleLogout()}}>
                <i className="fa-solid fa-right-from-bracket"></i> Log Out
            </div>
        </div>
    )
}
export default Navbar