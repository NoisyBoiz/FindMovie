import React, {useEffect, useRef, useState} from "react";
import {useNavigate,Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import "../style/header.css";
import Navbar from "./navbar";
import listData from "../data/listData";
import DragScrolling from "../function/dragScrolling";
import DarkMode from "../function/darkMode";
import {BsSunFill,BsMoonFill} from 'react-icons/bs';
import {MdLanguage} from 'react-icons/md';
import {BiUserCircle} from 'react-icons/bi';
import LocalStorage from "../function/localStorage.js";

function Header(){
    const navigate = useNavigate();
    const {t,i18n} = useTranslation();
    const [showSlider, setShowSlider] = useState(false);
    const [showMenuMobi, setShowMenuMobi] = useState(false);
    const [indexGenres, setIndexGenres] = useState([]);
    const [showListCountry, setShowListCountry] = useState(false);
    const [indexCountry, setIndexCountry] = useState(null);
    const [showListSort, setShowListSort] = useState(false);
    const [indexSort, setIndexSort] = useState(null);
    const [directionSort, setDirectionSort] = useState(false);
    const [querySearchNavbar, setQuerySearchNavbar] = useState("");
    const [dropDownLanguage,setDropDownLanguage] = useState(false);
    const [userInfor,setUserInfor] = useState(null);
    const [isDarkMode,setIsDarkMode] = useState(LocalStorage.getDarkMode());
    const sliderRef = useRef(null);
    const menuMobiRef = useRef(null);
    const languageRef = useRef(null);
    let outsideClick = (e)=>{
        if(sliderRef.current!==null)
        if(!sliderRef.current.contains(e.target)) setShowSlider(false);
        if(menuMobiRef.current!==null) 
        if(!menuMobiRef.current.contains(e.target)) setShowMenuMobi(false);
        if(languageRef.current!==null)
        if(!languageRef.current.contains(e.target)) setDropDownLanguage(false);
    }
    useEffect(()=>{
        document.addEventListener("click",(e)=>{outsideClick(e);});
    })
    const updateindexGenres = (x)=>{
        indexGenres.includes(x)?setIndexGenres(indexGenres.filter(item=>item!==x)):setIndexGenres([...indexGenres,x]);
    }
    const searchFunc = ()=>{
        if(querySearchNavbar==="") return;
        document.getElementsByName('searchInput')[0].value="";
        navigate('/search/1/'+querySearchNavbar);
    }
    const filterFunc = ()=>{
        if(indexGenres.length===0&&indexCountry===null&&indexSort===null) return;
        let arrGenres = [];
        for(let i=0;i<indexGenres.length;i++){
            arrGenres.push(listData.genres[indexGenres[i]].id);
        }
    
        let url =(indexGenres.length?"&with_genres="+arrGenres.join(","):"")+(indexCountry!=null?"&region="+listData.country[indexCountry].sign:"")+(indexSort!=null?"&sort_by="+listData.sort[indexSort].method+(directionSort?".asc":".desc"):"");
        navigate('/search/0/'+url);
    }
   
    const getUserInfor = ()=>{
        const userInfor = localStorage.getItem("user-info")?JSON.parse(localStorage.getItem("user-info")):null;
        if(userInfor!==null) setUserInfor(userInfor);
    }

    useEffect(()=>{getUserInfor()},[])

    const changeLanguage = (sign) => {
        i18n.changeLanguage(sign)
        LocalStorage.setLanguage(sign);
    }
   
    return(
        <>
        <div className={`maskOutClick ${(showSlider||showMenuMobi)?"showMaskOutClick":"hiddenMaskOutClick"}`}></div>
        <div className="header" >
            <div className="headerContainer">
                <div className="menuMobi" ref={menuMobiRef}>
                    <i className="fa-solid fa-bars iconMenu" onClick={()=>{setShowMenuMobi(!showMenuMobi)}}></i>
                    <div className={`navbarMobi ${showMenuMobi? "showNavbarMobi":"hiddenNavbarMobi"}`}>
                        <Navbar/>
                    </div>  
                </div>
                <div className="logoWeb"><Link to="/"><h1><span>MO</span><span>VIE</span></h1></Link></div>
                <div ref={sliderRef} className="searchNavBarContainer">
                    <div className="searchInputNavBar">
                        <i onClick={()=>{searchFunc()}} className="searchButtonNavBar fa-solid fa-magnifying-glass"></i>
                        <input type="text" name="searchInput" placeholder={t("Search")} onChange={(e)=>{setQuerySearchNavbar(e.target.value)}} onKeyDown={(e)=>{if(e.key==="Enter"){searchFunc()}}}/>
                        <i className="searchSliderNavBar fa-solid fa-sliders" onClick={()=>{setShowSlider(!showSlider)}}></i> 
                    </div>
                    <div className={showSlider?"showSliderBar":"hiddenSliderBar"} >
                        <button className="buttonFilter" onClick={filterFunc}> {t("Filter")} </button>
                        <div className="sliderSort" onMouseMove={()=>{setShowListSort(true)}} onMouseOut={()=>{setShowListSort(false)}}>
                            <p className={indexSort!=null?"focusSort":"unfocusSort"}> {indexSort==null?t("Arrange"):t(listData.sort[indexSort].name)} <i className={`fa-solid fa-arrow-down ${directionSort?"upSort":"downSort"}`} onClick={()=>{setDirectionSort(!directionSort)}}></i> <button className={`clearIndexSort ${indexSort==null?"addIndexSort":"removeIndexSort"}`} onClick={()=>{setIndexSort(null);}}> + </button> </p>
                            <div className={showListSort?"showListSort":"hiddenListSort"}>
                                <ul>
                                    {listData.sort.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexSort===index?"chooseSort":"unchooseSort"} onClick={()=>{indexSort!==index?setIndexSort(index):setIndexSort(null)}}> {t(item.name)} </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="sliderGenres" > 
                            <p className={indexGenres.length?"focusGenres":"unfocusGenres"} > <span> {indexGenres.length} </span> {t("Genres")} <button className={`clearIndexGenres ${indexGenres.length?"removeIndexGenres":"addIndexGenres"}`} onClick={()=>{setIndexGenres([]);}}> + </button> </p>
                            <div className="listGenres" onMouseDown={(e)=>{DragScrolling(e,"listGenres")}}>
                                <ul>
                                    {listData.genres.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexGenres.includes(index)?"chooseGenre":"unchooseGenre"} onClick={()=>{updateindexGenres(index)}}>{t(item.name)}<span className={indexGenres.includes(index)?"addIconGenres":"removeIconGenres"}>+</span></li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="sliderCountry" onMouseMove={()=>{setShowListCountry(true)}} onMouseLeave={()=>{setShowListCountry(false)}} >
                            <p className={indexCountry==null?"unfocusCountry":"focusCountry"}> {indexCountry==null?t("Country"):t(listData.country[indexCountry].name)} <button className={`clearIndexCountry ${indexCountry==null?"addIndexCountry":"removeIndexCountry"}`} onClick={()=>{setIndexCountry(null)}}>+</button></p>
                            <div className={`listCountry ${showListCountry?"showListCountry":"hiddenListCountry"}`}>
                                <ul >
                                    {listData.country.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexCountry===index?"chooseCountry":"unchooseCountry"} onClick={()=>{indexCountry!==index?setIndexCountry(index):setIndexCountry(null)}} >{t(item.name)}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userIcon"> 
                    <div className="settingHeader"> 
                        <div className="dropDownLanguage" ref={languageRef}>
                            <p className="gr-language" onClick={()=>{setDropDownLanguage(!dropDownLanguage)}}> <MdLanguage/> </p>
                            <div className={dropDownLanguage?"showDropDownLanguage":"hiddenDropDownLanguage"}>
                                <ul>
                                    <li className={LocalStorage.getLanguage()==='vi'?"focusLanguage":""} onClick={()=>{changeLanguage("vi")}}> {t("Vietnamese")} </li>
                                    <li className={LocalStorage.getLanguage()==='en'?"focusLanguage":""} onClick={()=>{changeLanguage("en")}}> {t("English")} </li>
                                    <li className={LocalStorage.getLanguage()==='fr'?"focusLanguage":""} onClick={()=>{changeLanguage("fr")}}> {t("French")} </li>
                                    <li className={LocalStorage.getLanguage()==='ko'?"focusLanguage":""} onClick={()=>{changeLanguage("ko")}}> {t("Korean")} </li>
                                    <li className={LocalStorage.getLanguage()==='de'?"focusLanguage":""} onClick={()=>{changeLanguage("de")}}> {t("German")} </li>
                                    <li className={LocalStorage.getLanguage()==='ru'?"focusLanguage":""} onClick={()=>{changeLanguage("ru")}}> {t("Russian")} </li>
                                    <li className={LocalStorage.getLanguage()==='ja'?"focusLanguage":""} onClick={()=>{changeLanguage("ja")}}> {t("Japanese")} </li>
                                    <li className={LocalStorage.getLanguage()==='zh'?"focusLanguage":""} onClick={()=>{changeLanguage("zh")}}> {t("Chinese")} </li>
                                </ul>
                            </div>
                        </div>
                        <div className="darkModeHeader">{!isDarkMode?<p className="bs-sun" onClick={()=>{setIsDarkMode(true); LocalStorage.setDarkMode('true');DarkMode(true);}}> <BsMoonFill/> </p>:<p className="bs-moon" onClick={()=>{setIsDarkMode(false);LocalStorage.setDarkMode('false');DarkMode(false);}}><BsSunFill/></p>}</div>
                    </div>
                    <div className="loginHeader"> {userInfor!==null?<> <p className="bi-user"><BiUserCircle/></p> {userInfor.name} </>:<Link to="/login" className="loginButton"> <p className="bi-user"><BiUserCircle/></p> <span> {t("Sign In")} </span> </Link>} </div>
                </div>
            </div>
            
        </div>
        </>
    )
}
export default Header