import {useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/home.css";

import {GoStar} from 'react-icons/go';

import CardMovie from "../component/cardMovie.jsx";
import Pagination from "../component/pagination.jsx"
import StyleTitle from "../utils/styleTitle.jsx";
import DragScrolling from "../utils/dragScrolling.jsx";
import MoviesService from "../services/movies.jsx";
import LocalStorage from "../utils/localStorage.jsx";
import ListData from "../data/listData.jsx";

function Home(){
    const {t} = useTranslation();
    const posterURL = "https://image.tmdb.org/t/p/w500";
    const backDropURL ="https://image.tmdb.org/t/p/w1280";
    const [dataTrendingDay,setDataTrendingDay] = useState(null);
    const [dataTrendingWeek,setDataTrendingWeek] = useState(null);
    const [dataBackDrop,setDataBackDrop] = useState(null);
    const [indexSlide, setIndexSlide] = useState(0);
    const [preIndexSlide, setPreIndexSlide] = useState(0);
    const [trendingTime, setTrendingTime] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [dataPopular,setDataPopular] = useState(null);
    const [indexPage,setIndexPage] = useState(1);
    const [arrFavorite,setArrFavorite] = useState(LocalStorage.getFavorite());
    
    // Use useRef instead of let variable for better React compatibility
    const arrTimeOut = useRef(null);

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
        // Clear any existing timers to prevent conflicts
        if(arrTimeOut.current !== null){
            clearTimeout(arrTimeOut.current);
            arrTimeOut.current = null;
        }
        
        // Add safety checks for DOM elements
        const backdropElement = document.getElementsByClassName('home__backdrop')[0];
        if(!backdropElement) return;
        
        try {
            backdropElement.style.opacity = 0;
            setTimeout(() => {
                if(indexSlide !== undefined && x >= 0 && dataBackDrop && x < dataBackDrop.length) {
                    setIndexSlide(x);
                    setTimeout(() => {
                        const updatedBackdropElement = document.getElementsByClassName('home__backdrop')[0];
                        if(updatedBackdropElement) {
                            updatedBackdropElement.style.opacity = 1;
                        }
                    }, 20);
                }
            }, 360);
        } catch (error) {
            console.warn('Error in changeIndexSlice:', error);
            // Fallback: just update the index
            if(x >= 0 && dataBackDrop && x < dataBackDrop.length) {
                setIndexSlide(x);
            }
        }
    }
   
    // animation slide backdrop
    const moveSlideBackDrop = (x)=>{
        if(arrTimeOut.current !== null){
            clearTimeout(arrTimeOut.current);
            arrTimeOut.current = null;
        }
        
        // Add safety checks for DOM elements and data
        if(x !== preIndexSlide && 
           dataBackDrop && 
           dataBackDrop.length > 0 && 
           x >= 0 && 
           x < dataBackDrop.length &&
           document.querySelector('.home__poster-box') !== null &&
           document.getElementsByClassName('home__slide-card')[0] !== undefined){
            
            changeIndexSlice(x);
            let n = x;
            if(x < preIndexSlide) n--;
            
            // Add error handling for offsetWidth
            try {
                const posterElement = document.querySelector('.home__poster-box');
                const slideElement = document.getElementsByClassName('home__slide-card')[0];
                
                if(posterElement && slideElement) {
                    let width = posterElement.offsetWidth;
                    if(n === 1) width = width / 1.5;
                    if(n > dataBackDrop.length / 2) {
                        if(x > preIndexSlide) width = width * 1.09;
                        else width = width * 1.16;
                    }
                    
                    slideElement.scrollTo({
                        left: width * n,
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    setPreIndexSlide(x);
                    
                    // Reset auto-slide timer after manual interaction
                    if(arrTimeOut.current !== null){
                        clearTimeout(arrTimeOut.current);
                        arrTimeOut.current = null;
                    }
                    arrTimeOut.current = setTimeout(timeSlide, 5000);
                }
            } catch (error) {
                console.warn('Error in slide animation:', error);
                // Fallback: just update the index without animation
                setPreIndexSlide(x);
            }
        }
    }

    const timeSlide = () => {
        // Add safety checks before proceeding
        if(!dataBackDrop || dataBackDrop.length === 0) return;
        
        try {
            if(indexSlide < dataBackDrop.length - 1) {
                moveSlideBackDrop(indexSlide + 1);
            } else {
                moveSlideBackDrop(0);
            }
        } catch (error) {
            console.warn('Error in timeSlide:', error);
        }
    }

    // Handle manual poster click separately to avoid conflicts
    const handlePosterClick = (clickedIndex) => {
        // Add safety checks
        if(!dataBackDrop || clickedIndex < 0 || clickedIndex >= dataBackDrop.length) return;
        
        // Clear existing auto-slide timer immediately
        if(arrTimeOut.current !== null){
            clearTimeout(arrTimeOut.current);
            arrTimeOut.current = null;
        }
        
        // Only proceed if clicking a different poster
        if(clickedIndex !== indexSlide) {
            try {
                moveSlideBackDrop(clickedIndex);
            } catch (error) {
                console.warn('Error in handlePosterClick:', error);
                // Fallback: just update the index
                setIndexSlide(clickedIndex);
            }
        }
    }

    // Cleanup timer when component unmounts
    useEffect(() => {
        return () => {
            if(arrTimeOut.current !== null){
                clearTimeout(arrTimeOut.current);
                arrTimeOut.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Clear existing timer first
        if(arrTimeOut.current !== null){
            clearTimeout(arrTimeOut.current);
            arrTimeOut.current = null;
        }
        
        // Only set new timer if data is available and component is mounted
        if(dataBackDrop && dataBackDrop.length > 0 && indexSlide >= 0 && indexSlide < dataBackDrop.length) {
            // Add a slight delay to ensure DOM is ready
            const timer = setTimeout(() => {
                arrTimeOut.current = setTimeout(timeSlide, 5000);
            }, 100);
            
            // Cleanup function
            return () => {
                clearTimeout(timer);
                if(arrTimeOut.current !== null){
                    clearTimeout(arrTimeOut.current);
                    arrTimeOut.current = null;
                }
            };
        }
        
        // Cleanup function for when conditions aren't met
        return () => {
            if(arrTimeOut.current !== null){
                clearTimeout(arrTimeOut.current);
                arrTimeOut.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indexSlide, dataBackDrop]);
    
    //Animation change Trending Time
    useEffect(()=>{
        let hiddenElement,showELement,hiddenImg,showImg;
        if(trendingTime){
            hiddenElement = document.getElementsByClassName("home__trending-slide--day");
            showELement = document.getElementsByClassName("home__trending-slide--week");
            hiddenImg = document.getElementsByClassName("home__trending-card--day");
            showImg = document.getElementsByClassName("home__trending-card--week");
        }
        else {
            hiddenElement = document.getElementsByClassName("home__trending-slide--week");
            showELement = document.getElementsByClassName("home__trending-slide--day");
            hiddenImg = document.getElementsByClassName("home__trending-card--week");
            showImg = document.getElementsByClassName("home__trending-card--day");
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
            <div className="home__hero"> 
                {dataBackDrop!==null?
                    <div className="home__backdrop" > 
                        <div className="home__backdrop-image"><img src={backDropURL + dataBackDrop[indexSlide].backdrop_path} alt="backdrop"/></div>
                        <div className="home__backdrop-content"> 
                            <div className="home__backdrop-header">
                                <div className="home__coming-badge" style={cmpDate(getReleaseDate(dataBackDrop[indexSlide]))?{opacity:1}:{opacity:0}}> {t("Coming Soon")} </div>
                                <div className="home__backdrop-meta">
                                    <span className="home__release-date"> {formatTime(getReleaseDate(dataBackDrop[indexSlide]))} </span>
                                    <span className="home__rating"> <span className="home__rating-average"> <p> <GoStar/> </p> {Math.floor(dataBackDrop[indexSlide].vote_average*10)/10} </span>  <span className="home__vote-count"> {dataBackDrop[indexSlide].vote_count} </span> </span> 
                                    <div className="home__genres"> 
                                        {getGenres(dataBackDrop[indexSlide].genre_ids).map((item,index)=>{
                                            return(<div key={index}>{t(item)}</div>)
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="home__title">{StyleTitle(dataBackDrop[indexSlide].title)}</div>
                            <div className="home__overview">{dataBackDrop[indexSlide].overview}</div>
                            <div className="home__actions">
                                <Link to={"/detail/movie/"+dataBackDrop[indexSlide].id} className="home__detail-button" onClick={scrollTop}>
                                    <button> {t("Detail")} </button>
                                </Link>
                                <button className={`home__favorite-button ${arrFavorite.find(item=>item.id===dataBackDrop[indexSlide].id)?"home__favorite-button--active":"home__favorite-button--inactive"}`} 
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
                <div className="home__slide-container">
                    <div className="home__slide-card">
                        {dataBackDrop!==null&&dataBackDrop.map((item,index)=>{
                            return(
                                <div key = {item.id} className="home__poster-box" onClick={()=>{handlePosterClick(index)}}>
                                    <img src={posterURL+item.poster_path} alt="backdrop" className={indexSlide===index?"home__poster--focus":"home__poster--unfocus"}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="home__content">
                <div className="home__trending">
                    <h2>{t("Trending")}</h2> 
                    <div className="home__trending-controls"> 
                        <button 
                            onClick={()=>{setTrendingTime(0);}} 
                            className={trendingTime?"inactive":"active"}
                        > 
                            {t("Day")} 
                        </button> 
                        <button 
                            onClick={()=>{setTrendingTime(1);}} 
                            className={trendingTime?"active":"inactive"}
                        > 
                            {t("Week")} 
                        </button>
                    </div>
                    
                    <div className="home__trending-container">
                        <div className="home__trending-slide home__trending-slide--day" onMouseDown={(e)=>{DragScrolling(e,'home__trending-slide--day')}} >
                            {dataTrendingDay!==null&&dataTrendingDay.map((item,index)=>{
                                return(
                                    <Link key={index} className="home__trending-card home__trending-card--day" to={"/detail/movie/"+item.id} onClick={scrollTop}>
                                        <div className="home__trending-image">
                                            <img src={posterURL+item.poster_path} alt="Trending" />
                                        </div>
                                        <div className="home__trending-content">
                                            <p className="home__trending-title"> {item.title?item.title:item.name} </p>
                                            <p className="home__trending-date"> {item.release_date?item.release_date:item.first_air_date} </p>
                                        </div>
                                        {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="home__trending-badge">{t("Coming Soon")}</p>}
                                        <p className="home__trending-rating"> {Math.floor(item.vote_average*10)/10} </p>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="home__trending-slide home__trending-slide--week" onMouseDown={(e)=>{DragScrolling(e,'home__trending-slide--week')}} >
                            {dataTrendingWeek!==null&&dataTrendingWeek.map((item,index)=>{
                                return(
                                    <Link key = {index} className="home__trending-card home__trending-card--week" to={"/detail/movie/"+item.id} onClick={scrollTop}>
                                        <div className="home__trending-image">
                                            <img src={posterURL+item.poster_path} alt="Trending" />
                                        </div>
                                        {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="home__trending-badge">{t("Coming Soon")}</p>}
                                        <p className="home__trending-rating"> {Math.floor(item.vote_average*10)/10} </p>
                                        <div className="home__trending-content">
                                            <p className="home__trending-title"> {item.title?item.title:item.name} </p>
                                            <p className="home__trending-date"> {item.release_date?item.release_date:item.first_air_date} </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="common-container">
                    <h2> {t("Popular")} </h2>
                    {dataPopular!==null&&
                        <>
                            <CardMovie data={dataPopular} method={"movie"}/>
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


