// this function is used to update the pagination button
function Button (setArrButton,curPage,totalPages){
        let arr = [];
        let limitButton = 6;
        if(totalPages>limitButton){
            if(curPage<=totalPages-(limitButton-3)){
                let x=0;
                if(curPage>=2) x=-1;
                for(let i=1;i<=limitButton;i++){
                    if(i===1&&curPage>2){arr.push({sign:"...",index:curPage+x-1});}
                    else if(i===limitButton) {arr.push({sign:"...",index:curPage+x});}
                    else{arr.push({sign:curPage+x,index:curPage+x});x++;}
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
        setArrButton(arr);
}
export default Button;