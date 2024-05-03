import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/home.css";

import {GoStar} from 'react-icons/go';

import CardMovie from "../component/cardMovie";
import Pagination from "../component/pagination"
import StyleTitle from "../function/styleTitle";
import DragScrolling from "../function/dragScrolling";
import MoviesService from "../services/movies.js";
import LocalStorage from "../function/localStorage.js";
import ListData from "../data/listData.js";

function Home(){
    const {t} = useTranslation();
    const posterURL = "https://image.tmdb.org/t/p/w500";
    const backDropURL ="https://image.tmdb.org/t/p/w1280";
    const [dataTrendingDay,setDataTrendingDay] = useState(null);
    const [dataTrendingWeek,setDataTrendingWeek] = useState(null);
    const [dataBackDrop,setDataBackDrop] = useState(null);
    const [indexSlide, setIndexSlide] = useState(0);
    const [indexSlideFlash, setIndexSlideFlash] = useState(0);
    const [preIndexSlide, setPreIndexSlide] = useState(0);
    const [trendingTime, setTrendingTime] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [dataPopular,setDataPopular] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [arrFavorite,setArrFavorite] = useState(LocalStorage.getFavorite());
    
    let arrTimeOut = null;

    const scrollTop = ()=>{
        window.scrollTo(0,0);
    }
    const cmpDate = (x)=>{
        return new Date(x).getTime()>new Date().getTime()?true:false;
    }
    const formatTime = (time) => {
        return new Date(time).toLocaleDateString()
    }
    // get data back drop 
    useEffect(()=>{
        MoviesService.getMovies('movie/upcoming', LocalStorage.getLanguage(),1).then((res) => {
            setDataBackDrop(res.results);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[LocalStorage.getLanguage()]);
    // get data trending
  
    useEffect(()=>{
        MoviesService.getMovies((trendingTime===0?"trending/all/day":"trending/all/week"), LocalStorage.getLanguage(),1).then((res) => {
            trendingTime===0?setDataTrendingDay(res.results):setDataTrendingWeek(res.results)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[trendingTime,LocalStorage.getLanguage()]);
    // 
    const changeIndexSlice = (x) => {
        setIndexSlideFlash(x);
        document.getElementsByClassName('homeBackDrop')[0].style.opacity = 0;
        setTimeout(()=>{
            if(indexSlide!==undefined)
                setIndexSlide(x);
            setTimeout(()=>{
                if(document.getElementsByClassName('homeBackDrop')[0]!==undefined)
                    document.getElementsByClassName('homeBackDrop')[0].style.opacity = 1;
            },20);
        },360);
    }
   
    // animation slide backdrop
    const moveSlideBackDrop = (x)=>{
        if(arrTimeOut!== null){
            clearTimeout(arrTimeOut);
            arrTimeOut = null;
        }
        
        if(x!==preIndexSlide&&document.querySelector('.homePosterBox')!==null){
            changeIndexSlice(x);
            let n=x;
            if(x<preIndexSlide) n--;
            let width = document.querySelector('.homePosterBox').offsetWidth;
            if(n===1) width=width/1.5;
            if(n>dataBackDrop.length/2) {
                if(x>preIndexSlide) width=width*1.09;
                else width=width*1.16;
            }
            document.getElementsByClassName('homeSlideCard')[0].scrollTo({left:width*n,top: 0,behavior:'smooth'});
            setPreIndexSlide(x);
        }
    }

    const timeSlide = ()=>{
        if(dataBackDrop===null) return
        if(indexSlide<dataBackDrop.length - 1) moveSlideBackDrop(indexSlide+1);
        else moveSlideBackDrop(0);
        clearTimeout(arrTimeOut);
    }

    useEffect(()=>{
        if(arrTimeOut!==null){
            clearTimeout(arrTimeOut);
            arrTimeOut = null;
        }
        arrTimeOut = setTimeout(timeSlide,5000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexSlide,dataBackDrop]);
    
    //Animation change Trending Time
    useEffect(()=>{
        let hiddenElement,showELement,hiddenImg,showImg;
        if(trendingTime){
            hiddenElement = document.getElementsByClassName("trendingSlideDay");
            showELement = document.getElementsByClassName("trendingSlideWeek");
            hiddenImg = document.getElementsByClassName("styleImgTrending1");
            showImg = document.getElementsByClassName("styleImgTrending2");
        }
        else {
            hiddenElement = document.getElementsByClassName("trendingSlideWeek");
            showELement = document.getElementsByClassName("trendingSlideDay");
            hiddenImg = document.getElementsByClassName("styleImgTrending2");
            showImg = document.getElementsByClassName("styleImgTrending1");
        }
        if(hiddenElement[0]!==undefined) hiddenElement[0].style.opacity = "0";
        if(hiddenImg!==undefined)
        Array.from(hiddenImg).forEach((element,index) => {
            element.style.transform = "translateY(-100%)";
            element.style.transitionDelay = 0.05*index+"s";
        });
        setTimeout(()=>{
            if(hiddenElement[0]!==undefined) hiddenElement[0].style.display = "none";
            setTimeout(()=>{
                if(showELement[0]!==undefined){
                    showELement[0].style.display = "flex";
                    showELement[0].style.opacity= 0;
                    if(showImg!==undefined) Array.from(showImg).forEach(element =>{element.style.transform = "translateY(100%)";});
                    showELement[0].scrollTo({left:0,top: 0});
                }
                setTimeout(()=>{
                    if(showELement[0]!==undefined) showELement[0].style.opacity = 1;
                    if(showImg[0]!==undefined)
                    Array.from(showImg).forEach((element,index) => {
                        element.style.transform = "translateY(0%)";
                        element.style.transitionDelay = 0.05*index+"s";
                    });
                },20);
            },20);
        },500);
    },[trendingTime])
   
    useEffect(()=>{
        setIndexPage(1);
        MoviesService.getMovies("movie/popular",LocalStorage.getLanguage(),1).then(res => {
            if(res.results===null) return;
            setTotalPages(res.total_pages);
            setDataPopular(res.results);
        })
    },[LocalStorage.getLanguage()]);

    useEffect(()=>{
        if(indexPage===1) return;
        if(LocalStorage.getShowPagination()) MoviesService.getMovies("movie/popular",LocalStorage.getLanguage(),indexPage).then(res => {setDataPopular(res.results);});
        else MoviesService.getMovies("movie/popular",LocalStorage.getLanguage(),indexPage).then(res => {setDataPopular([...dataPopular,...res.results])});
    },[indexPage])
    
    const getReleaseDate = (x)=>{
        return x.release_date?x.release_date:x.first_air_date;
    }
      
    const getGenres = (x) => {
        let genresID = [];
        x.forEach((x)=>{
            ListData.genres.forEach((y)=>{
                if(y.id===x) genresID.push(y.name);
            })
        });
        return genresID;
    }

    return(
        <>
        <div className="home">
            <div className="homeTop"> 
                {dataBackDrop!==null?
                    <div className="homeBackDrop" > 
                        <div className="imgBackDrop"><img src={backDropURL + dataBackDrop[indexSlide].backdrop_path} alt="backdrop"/></div>
                        <div className="backDropContent"> 
                            <div className="topBDContent">
                                <div className="backDropComing" style={cmpDate(getReleaseDate(dataBackDrop[indexSlide]))?{opacity:1}:{opacity:0}}> {t("Coming Soon")} </div>
                                <div className="bottomTBDContent">
                                    <span className="backDropTime"> {formatTime(getReleaseDate(dataBackDrop[indexSlide]))} </span>
                                    <span className="backDropRate"> <span className="rateAverage"> <p> <GoStar/> </p> {Math.floor(dataBackDrop[indexSlide].vote_average*10)/10} </span>  <span className="backDropVoteCount"> {dataBackDrop[indexSlide].vote_count} </span> </span> 
                                    <div className="backDropGenres"> 
                                        {getGenres(dataBackDrop[indexSlide].genre_ids).map((item,index)=>{
                                            return(<div key={index}>{t(item)}</div>)
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="backDropTitle">{StyleTitle(dataBackDrop[indexSlide].title)}</div>
                            <div className="backDropOverview">{dataBackDrop[indexSlide].overview}</div>
                            <div className="bottomBDContent">
                                <Link to={"/detail/movie/"+dataBackDrop[indexSlide].id} className="buttonDetailBD" onClick={scrollTop}>
                                    <button> {t("Detail")} </button>
                                </Link>
                                <button className={`buttonFavoriteBD ${arrFavorite.find(item=>item.id===dataBackDrop[indexSlide].id)?"activeFavorite":"inactiveFavorite"}`} 
                                    onClick={()=>{
                                        let rs = LocalStorage.setFavorite(dataBackDrop[indexSlide].id,"movie",dataBackDrop[indexSlide].poster_path,dataBackDrop[indexSlide].title,getReleaseDate(dataBackDrop[indexSlide]),dataBackDrop[indexSlide].vote_average);
                                        if(rs!==null) setArrFavorite(rs);
                                    }}
                                > <i className="fa-solid fa-heart"></i> {t("Favorite")} </button>
                            </div>
                        </div>
                    </div>
                :""
                }
                <div className="homeSlideContainer">
                    <div className="homeSlideCard">
                        {dataBackDrop!==null&&dataBackDrop.map((item,index)=>{
                            return(
                                <div key = {item.id} className="homePosterBox" onClick={()=>{moveSlideBackDrop(index)}}>
                                    <img src={posterURL+item.poster_path} alt="backdrop" className={indexSlideFlash===index?"focusPoster":"unfocusPoster"}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="homeContent">
                <div className="trendingContainer">
                    <div className="timeTrending"> <h2>{t("Trending")}</h2> <button onClick={()=>{setTrendingTime(0);}} className={trendingTime?"unfocusTrendingTime":"focusTrendingTime"}> {t("Day")} </button> <button onClick={()=>{setTrendingTime(1);}} className={trendingTime?"focusTrendingTime":"unfocusTrendingTime"}> {t("Week")} </button></div>
                    <div className="trendingBox">
                        <div className="trendingSlide trendingSlideDay" onMouseDown={(e)=>{DragScrolling(e,'trendingSlideDay')}} >
                            {dataTrendingDay!==null&&dataTrendingDay.map((item,index)=>{
                                return(
                                    <div key = {index} className="trendingCard styleImgTrending1">
                                        <Link to={"/detail/movie/"+item.id} key = {item.id} onClick={scrollTop}>
                                            <img src={posterURL+item.poster_path} alt="Trending" />
                                            {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="trendingCardComing">{t("Coming Soon")}</p>}
                                            <p className="trendingCardRate"> {Math.floor(item.vote_average*10)/10} </p>
                                            <div className="trendingCardContent">
                                                <p className="trendingCardName"> {item.title?item.title:item.name} </p>
                                                <p className="trendingCardDay"> {item.release_date?item.release_date:item.first_air_date} </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="trendingSlide trendingSlideWeek" onMouseDown={(e)=>{DragScrolling(e,'trendingSlideWeek')}} >
                            {dataTrendingWeek!==null&&dataTrendingWeek.map((item,index)=>{
                                return(
                                    <div key = {index} className="trendingCard styleImgTrending2">
                                        <Link to={"/detail/movie/"+item.id} key = {item.id} onClick={scrollTop}>
                                            <img src={posterURL+item.poster_path} alt="Trending" />
                                            {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="trendingCardComing">{t("Coming Soon")}</p>}
                                            <p className="trendingCardRate"> {Math.floor(item.vote_average*10)/10} </p>
                                            <div className="trendingCardContent">
                                                <p className="trendingCardName"> {item.title?item.title:item.name} </p>
                                                <p className="trendingCardDay"> {item.release_date?item.release_date:item.first_air_date} </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="common-container">
                    <h2> {t("Popular")} </h2>
                    {dataPopular!==null&&<>
                            <CardMovie data={dataPopular}/>
                            <Pagination totalPages={totalPages} indexPage={indexPage} setIndexPage={setIndexPage} showPagination={LocalStorage.getShowPagination()}/>
                        </>
                    }
                </div>
            </div>
        </div>
        </>
    )
}
export default Home


