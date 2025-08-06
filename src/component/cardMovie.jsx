import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/card.css";

function CardMovie({method,data}){
    const {t} = useTranslation();
    const posterURL = "https://image.tmdb.org/t/p/w500"

    const scrollTop = ()=>{
        window.scrollTo(0,0);
    }

    const cmpDate = (x)=>{
        return new Date(x).getTime()>new Date().getTime()?true:false;
    }

    return(
        <div className="card-container"> 
            {data!=null&&data.map((item,index)=>{
                return(
                    <div key = {index} className="card">
                        <Link to={"/detail/"+(method==="favorite"?item.method:method)+"/"+item.id} onClick={scrollTop}>
                            <img src={item.poster_path!=null?posterURL+item.poster_path:"https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/%E1%BA%A2nh%20ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%202023-05-04%20165735.png?v=1683194371036"} alt="popular" />
                            {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="comming"> {t("Coming Soon")}</p>}
                            <p className="rate"> {Math.floor(item.vote_average*10)/10} </p>
                            <div className="content">
                                <p className="title"> {item.title?item.title:item.name} </p>
                                <p className="release-date"> {item.release_date?item.release_date:item.first_air_date} </p>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
export default CardMovie;