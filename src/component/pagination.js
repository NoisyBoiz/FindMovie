import { useState } from 'react';
import {useTranslation} from 'react-i18next';
import '../style/pagination.css';

function setButton(indexPage,totalPages){
    let arr = [];
    let limitButton = 6;
    if(totalPages>limitButton){
        if(indexPage<=totalPages-(limitButton-3)){
            let x=0;
            if(indexPage>=2) x=-1;
            for(let i=1;i<=limitButton;i++){
                if(i===1&&indexPage>2){arr.push({sign:"...",index:indexPage+x-1});}
                else if(i===limitButton) {arr.push({sign:"...",index:indexPage+x});}
                else{arr.push({sign:indexPage+x,index:indexPage+x});x++;}
            }
        }
        else{
            let x=2;
            for(let i=1;i<=limitButton;i++){
                if(i===1) {arr.push({sign:"...",index:x+totalPages-limitButton-1});}
                else{arr.push({sign:x+totalPages-limitButton,index:x+totalPages-limitButton});x++;}
            }
        }
    }
    else{
        for(let i=1;i<=totalPages;i++){
            arr.push({sign:i,index:i});
        }
    }
    return arr;
}

function Pagination({totalPages, indexPage, setIndexPage, showPagination}){
    let [inputPage, setInputPage] = useState(indexPage);
    let arrButPage = setButton(indexPage,totalPages);
    const {t} = useTranslation();

    const changePage = (index, totalPages) => {
        setIndexPage(index);
        setInputPage(index);
        arrButPage = setButton(index,totalPages);
    }

    return(
        <div className="pagination">
            {showPagination? <>
                <button className="btn-pre" disabled={indexPage<=1} onClick={()=>{changePage(indexPage-1,totalPages)}}><i className="fa-solid fa-chevron-left"></i></button>
                <div className="btn-index"> 
                    {arrButPage.length&&arrButPage.map((item,index)=>{
                        return <button key={index} className={item.index===indexPage?"focus":"unfocus"} onClick={()=>{changePage(item.index,totalPages)}}> {item.sign} </button>
                    })}
                </div>
                <button className="btn-next" disabled={indexPage>=totalPages} onClick={()=>{changePage(indexPage+1,totalPages) }}><i className="fa-solid fa-chevron-right"></i></button>
                <div className="input"> <input type="number" value={inputPage} onChange={(e)=>{setInputPage(e.target.value);}} onKeyDown={(e)=>{if(e.key==="Enter"){if(Number(inputPage)>0&&Number(inputPage)<=totalPages){changePage(Number(inputPage),totalPages)}}}}/> <span> / {totalPages} </span> </div>
            </>
            :
            indexPage<totalPages?
            <button className="btn-more" onClick={()=>{setIndexPage(indexPage+1)}}> 
                <span> {t("More")} </span>
                <i className="fa-solid fa-angles-down"></i>
            </button>:""
            }
        </div>
    )
}
export default Pagination