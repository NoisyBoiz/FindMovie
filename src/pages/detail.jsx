import React, {useRef,useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import YouTube from 'react-youtube';
import ListData from "../data/listData.jsx";
import {useTranslation} from 'react-i18next';
import DragScrolling from "../utils/dragScrolling.jsx";
import {GoStar} from 'react-icons/go';
import "../style/detail.css";

import LocalStorage from "../utils/localStorage.jsx";
import MoviesService from "../services/movies.jsx";

let videoElement = null;

function Detail(){
    const {t} = useTranslation();
    const {method} = useParams();
    const {idMovie} = useParams();
    const imgActorURL = "https://image.tmdb.org/t/p/w138_and_h175_face";
    const posterURL = "https://image.tmdb.org/t/p/w500";
    const backDropURL = "https://image.tmdb.org/t/p/original";
    const imgTrailerURL = "https://img.youtube.com/vi/";
    const endImgTrailerURL = "/mqdefault.jpg"; //hqdefault.jpg maxresdefault.jpg

    const [dataDetail,setDataDetail] = useState(null);
    const [keyTrailer,setKeyTrailer] = useState(null);
    const [showTrailer,setShowTrailer] = useState(false);
    const [listGenresBD, setListGenresBD] = useState([]);
    const [arrFavorite,setArrFavorite] = useState([]);
    const [videoTrailer,setVideoTrailer] = useState([]);
    const trailerRef = useRef(null);

    const _onReady = (event) => {
        videoElement = event;
    };

    // Handle click outside trailer to close
    const handleTrailerOverlayClick = (e) => {
        if (trailerRef.current && !trailerRef.current.contains(e.target)) {
            setShowTrailer(false);
        }
    };
 
    let dataDetailFunc = (x) => {
        if(x!==null){
            setDataDetail(x);
            getKeyTrailer(x);
            getGenres(x);  
        }
        if(document.getElementsByClassName('detail__empty')[0]!==undefined) {
            x!=null?document.getElementsByClassName('detail__empty')[0].style.opacity = 0:
            document.getElementsByClassName('detail__empty')[0].style.opacity = 1;
        }
    }

    useEffect(()=>{
        MoviesService.getDetails(method,idMovie,LocalStorage.getLanguage()).then((data)=>{
            
            dataDetailFunc(data);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[LocalStorage.getLanguage()]);

    let getKeyTrailer = (x)=>{
        let rs = [];
        x.videos.results.forEach((x)=>{
            let type = x.type.toLowerCase();
            if(type==="trailer"||type==="featurette"||type==="teaser"){
                if(!(x.key in rs)) rs.push(x.key)
            }
        })
        setVideoTrailer(rs);
    }
    useEffect(()=>{
        if(videoElement!==null){
            if(showTrailer===true)videoElement.target.playVideo()
            else videoElement.target.pauseVideo();
        }
    },[showTrailer])

    // Add/remove event listener for trailer overlay click
    useEffect(() => {
        if (showTrailer) {
            document.addEventListener('mousedown', handleTrailerOverlayClick);
        } else {
            document.removeEventListener('mousedown', handleTrailerOverlayClick);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleTrailerOverlayClick);
        };
    }, [showTrailer]);

    let getGenres = (x)=>{
        let genresID = [];
        x.genres.forEach((x)=>{
            ListData.genres.forEach((y)=>{
                if(y.id===x.id) genresID.push(y.name);
            })
        })
        setListGenresBD(genresID);
    }
    let convertRunTime = (x)=>{
        let h = Math.floor(x/60);
        let m = x%60;
        return h+"h "+m+"m";
    }

    useEffect(()=>{ 
        setArrFavorite(LocalStorage.getFavorite());
    },[]);

    const HandleFavorite = (item)=>{
        let dataFavorite = LocalStorage.setFavorite(item.id,method,item.poster_path,item.title?item.title:item.name,item.release_date?item.release_date:item.first_air_date,Math.floor(item.vote_average*10)/10);
        if(dataFavorite!=null) setArrFavorite(dataFavorite);
    }

    return(
        <>{dataDetail!=null?(
            <>
            <div className="detail">
                <div className="detail__backdrop"> 
                    {dataDetail!=null&&<img src={backDropURL+dataDetail.backdrop_path} alt="backDrop" />}
                </div>
                <div className="detail__content"> 
                    <div className="detail__header"> 
                         <h3> {dataDetail.original_title?dataDetail.original_title:dataDetail.original_name} </h3>
                         <div className="detail__actions">
                             <button className="detail__button detail__button--share"> <i className="fa-solid fa-share-nodes"></i> {t("Share")} </button>
                             <button className={`detail__button detail__button--favorite ${arrFavorite.find(item=>item.id===dataDetail.id)?"active":"inactive"}`}
                                 onClick={()=>{HandleFavorite(dataDetail)}}
                             > <i className="fa-solid fa-heart"></i> {t("Favorite")} </button>
                         </div>
                    </div>
                    <div className="detail__main">
                        <div className="detail__sidebar"> 
                            {dataDetail!=null&&<img className="detail__poster" src={posterURL+dataDetail.poster_path} alt="poster" /> }
                            <div className="detail__rating-section">
                                <div className='detail__rating-container'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='detail__rating-circle'>
                                        <circle fill="transparent" className='detail__rating-circle-bg'/>
                                        <circle fill="transparent" className='detail__rating-circle-bar' style={{"--voteRate":Math.floor(dataDetail.vote_average*10)/10}} />
                                    </svg>
                                    <p className='detail__rating-text'> {Math.floor(dataDetail.vote_average*10)/10} </p>
                                </div>
                                <p> {dataDetail.vote_count} <span> {t("Ratings")} </span> </p>
                            </div>
                        </div>
                        <div className="detail__info"> 
                            <h1 className="detail__title"> {dataDetail.title?dataDetail.title:dataDetail.name} </h1>
                            <div className="detail__genres"> {listGenresBD.map((item,index)=>{return(<span key={index}>{t(item)}</span>)})}</div>
                            <p className="detail__release-date"> <span>{t("Release Date")}: </span> {dataDetail.release_date?dataDetail.release_date:dataDetail.first_air_date} </p>
                            <p className="detail__runtime"> <span> {t("Runtime")}: </span> {convertRunTime(dataDetail.runtime)} </p>
                            <div className="detail__overview">
                                <p> {t("Overview")} {!dataDetail.overview&&<span> ({t("No Overview")}) </span>}</p>
                                <span> {dataDetail.overview} </span>
                            </div>
                            <div className="detail__trailer-section">
                                <p> {t("Trailer")} {videoTrailer.length===0&&<span> ({t("No Trailer")}) </span>} </p>
                                <div className="detail__trailer-list-container" >
                                    <div className="detail__trailer-list" onMouseDown={(e)=>{DragScrolling(e,"detail__trailer-list-container")}}> 
                                        {videoTrailer.length!==0&&videoTrailer.map((x,index)=>{
                                            return <button key={index} className="detail__trailer-button" onClick={()=>{setShowTrailer(true);setKeyTrailer(x);}}> {<><img src={imgTrailerURL+x+endImgTrailerURL} width={150} height={90} alt="trailer"/><i className="fa-solid fa-caret-right"></i></>}  </button>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail__cast">
                    <p>  {t("Cast")} </p>
                        <div className="detail__cast-list">
                            <div className="detail__cast-scroll" onMouseDown={(e)=>{DragScrolling(e,"detail__cast-list")}}>
                                {dataDetail.credits.cast.map((item,index)=>{
                                    if(item.known_for_department === "Acting"){
                                        return(
                                            <div className="detail__actor-card" key={index}>
                                                <img src={item.profile_path!=null?imgActorURL+item.profile_path:"https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/img.jpg?v=1682936306067"} alt="actor"/>
                                                <p> {item.original_name} </p>
                                                <p> {item.character}</p>
                                            </div>
                                    )}
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="detail__comments">
                        <p> {t("Comment")} </p>
                        {dataDetail.reviews.results.length?(dataDetail.reviews.results.map((item,index)=>{
                                return(
                                    <>
                                    <div className="detail__comment-card">
                                        <div className="detail__comment-header"> 
                                            <div className="detail__author-avatar"> <img src={item.author_details.avatar_path!=null?item.author_details.avatar_path.slice(1):"https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/img.jpg?v=1682936306067"} alt="author"/> </div>
                                            <div className="detail__author-info"> 
                                                <h3> {item.author_details.name!==""?item.author_details.name:item.author} {item.author_details.rating!=null? <span> <p> <GoStar/> </p> {item.author_details.rating} </span>:""} </h3>
                                                <p> {new Date(item.created_at).toLocaleString()} </p>
                                            </div>
                                        </div>
                                        <div className="detail__comment-content"> {item.content} </div>
                                    </div>
                                    </>
                                )
                            })):<h3> {t("No Comment")} </h3>
                        }
                        {/* <div className="detail__comment-form">
                            <textarea type="text" placeholder={t("Write Comment")}/>
                            <button><i className="fa-regular fa-paper-plane"></i></button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className={`detail__modal ${showTrailer?"detail__modal--visible":"detail__modal--hidden"}`} onClick={handleTrailerOverlayClick}> 
                <div className="detail__modal-content" ref={trailerRef}>
                    {keyTrailer!=null&&<YouTube videoId={keyTrailer} className="detail__video" onReady={_onReady}/>}
                    <button className="detail__modal-close" onClick={()=>{setShowTrailer(false);}}> + </button>
                </div>
            </div>
          
        </>
        ):<div className="detail__empty">
            <h1> 4<i className="fa-solid fa-ghost"></i>4 </h1>
            <span> {t("No Detail1")} <br/>
            {t("No Detail2")} </span>
        </div>}
        </>
    )
}

export default Detail;
