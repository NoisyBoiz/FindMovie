import React, {useRef,useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import YouTube from 'react-youtube';
import ListData from "../data/listData.js";
import {useTranslation} from 'react-i18next';
import DragScrolling from "../function/dragScrolling";
import {GoStar} from 'react-icons/go';
import "../style/detail.css";

import LocalStorage from "../function/localStorage.js";
import MoviesService from "../services/movies";

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

    const _onReady = (event) => {
        videoElement = event;
    };
 
    let dataDetailFunc = (x) => {
        if(x!==null){
            setDataDetail(x);
            getKeyTrailer(x);
            getGenres(x);  
        }
        if(document.getElementsByClassName('emptyDataDetail')[0]!==undefined) {
            x!=null?document.getElementsByClassName('emptyDataDetail')[0].style.opacity = 0:
            document.getElementsByClassName('emptyDataDetail')[0].style.opacity = 1;
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
                <div className="detailBackDrop"> 
                    {dataDetail!=null&&<img src={backDropURL+dataDetail.backdrop_path} alt="backDrop" />}
                </div>
                <div className="detailContent"> 
                    <div className="topDetailContent"> 
                         <h3> {dataDetail.original_title?dataDetail.original_title:dataDetail.original_name} </h3>
                         <div className="buttonTopDC">
                             <button className="shareBTDC"> <i className="fa-solid fa-share-nodes"></i> {t("Share")} </button>
                             <button className={`favoriteBTDC ${arrFavorite.find(item=>item.id===dataDetail.id)?"activeFavoriteDetail":"inactiveFavoriteDetail"}`}
                                 onClick={()=>{HandleFavorite(dataDetail)}}
                             > <i className="fa-solid fa-heart"></i> {t("Favorite")} </button>
                         </div>
                    </div>
                    <div className="centerDetailContent">
                        <div className="leftDetailContent"> 
                            {dataDetail!=null&&<img className="detailPosterImg" src={posterURL+dataDetail.poster_path} alt="poster" /> }
                            <div className="bottomLDContent">
                                <div className='rateContainer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='circleRate'>
                                        <circle fill="transparent" className='fillCircle'/>
                                        <circle fill="transparent" className='barCircleRate' style={{"--voteRate":Math.floor(dataDetail.vote_average*10)/10}} />
                                    </svg>
                                    <p className='detailRate'> {Math.floor(dataDetail.vote_average*10)/10} </p>
                                </div>
                                <p> {dataDetail.vote_count} <span> {t("Ratings")} </span> </p>
                            </div>
                        </div>
                        <div className="rightDetailContent"> 
                            <h1 className="detailTitle"> {dataDetail.title?dataDetail.title:dataDetail.name} </h1>
                            <div className="detailGenres"> {listGenresBD.map((item,index)=>{return(<span key={index}>{t(item)}</span>)})}</div>
                            <p className="detailDate"> <span>{t("Release Date")}: </span> {dataDetail.release_date?dataDetail.release_date:dataDetail.first_air_date} </p>
                            <p className="detailRuntime"> <span> {t("Runtime")}: </span> {convertRunTime(dataDetail.runtime)} </p>
                            <div className="detailOverview">
                                <p> {t("Overview")} {!dataDetail.overview&&<span> ({t("No Overview")}) </span>}</p>
                                <span> {dataDetail.overview} </span>
                            </div>
                            <div className="trailerDetailContainer">
                                <p> {t("Trailer")} {videoTrailer.length===0&&<span> ({t("No Trailer")}) </span>} </p>
                                <div className="slideTDContainer" >
                                    <div className="slideTD" onMouseDown={(e)=>{DragScrolling(e,"slideTDContainer")}}> 
                                        {videoTrailer.length!==0&&videoTrailer.map((x,index)=>{
                                            return <button key={index} className="buttonShowTrailer" onClick={()=>{setShowTrailer(true);setKeyTrailer(x);}}> {<><img src={imgTrailerURL+x+endImgTrailerURL} width={150} height={90} alt="trailer"/><i className="fa-solid fa-caret-right"></i></>}  </button>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detailActorContainer">
                    <p>  {t("Cast")} </p>
                        <div className="listActorContainer">
                            <div className="slideActor" onMouseDown={(e)=>{DragScrolling(e,"listActorContainer")}}>
                                {dataDetail.credits.cast.map((item,index)=>{
                                    if(item.known_for_department === "Acting"){
                                        return(
                                            <div className="actorCard" key={index}>
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
                    <div className="cmtDetailContainer">
                        <p> {t("Comment")} </p>
                        {dataDetail.reviews.results.length?(dataDetail.reviews.results.map((item,index)=>{
                                return(
                                    <>
                                    <div className="cmtDetailCard">
                                        <div className="topCmtCard"> 
                                            <div className="authorCmtImg"> <img src={item.author_details.avatar_path!=null?item.author_details.avatar_path.slice(1):"https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/img.jpg?v=1682936306067"} alt="author"/> </div>
                                            <div className="authorCmtCard"> 
                                                <h3> {item.author_details.name!==""?item.author_details.name:item.author} {item.author_details.rating!=null? <span> <p> <GoStar/> </p> {item.author_details.rating} </span>:""} </h3>
                                                <p> {new Date(item.created_at).toLocaleString()} </p>
                                            </div>
                                        </div>
                                        <div className="centerCmtCard"> {item.content} </div>
                                    </div>
                                    </>
                                )
                            })):<h3> {t("No Comment")} </h3>
                        }
                        <div className="yourCmtCrad">
                            <textarea type="text" placeholder={t("Write Comment")}/>
                            <button><i className="fa-regular fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`trailerContainer ${showTrailer?"showTrailer":"hiddenTrailer"}`}> 
               {keyTrailer!=null&&<YouTube videoId={keyTrailer} className="trailerMovie" onReady={_onReady}/>}
                <button className="buttonHiddenTrailer" onClick={()=>{setShowTrailer(false);}}> + </button>
            </div>
          
        </>
        ):<div className="emptyDataDetail">
            <h1> 4<i className="fa-solid fa-ghost"></i>4 </h1>
            <span> {t("No Detail1")} <br/>
            {t("No Detail2")} </span>
        </div>}
        </>
    )
}

export default Detail;
