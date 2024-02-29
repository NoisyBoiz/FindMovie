const localStorage = window.localStorage;
const ls = {
    getLanguage: ()=>{
        return localStorage.getItem("language")!==null?localStorage.getItem("language"):"en";
    },
    setLanguage: (x)=>{
        localStorage.setItem("language",x);
    },
    getShowPagination: ()=>{
        if(localStorage.getItem("showPagination")===null) localStorage.setItem("showPagination","true");
        return localStorage.getItem("showPagination")==="true"?true:false;
    },
    setShowPagination: (x)=>{
        x = x?"true":"false";
        localStorage.setItem("showPagination",x);
    },
    getDarkMode: ()=>{
        if(localStorage.getItem("darkMode")===null) localStorage.setItem("darkMode","true");
        return localStorage.getItem("darkMode")==="true"?true:false;
    },
    setDarkMode: (x)=>{
        x = x?"true":"false";
        localStorage.setItem("darkMode",x);
    },
    getFavorite: () => {
        return localStorage.getItem("dataFavorite")?JSON.parse(localStorage.getItem("dataFavorite")):[];
    },
    setFavorite: (id,method,poster_path,title,release_date,vote_average) => {
        if(id===null||poster_path===""||title===""||release_date===""||vote_average===0) return null;
        let dataFavorite = localStorage.getItem("dataFavorite")?JSON.parse(localStorage.getItem("dataFavorite")):[];
        if(dataFavorite.find(item=>item.id===id)){
            dataFavorite.splice(dataFavorite.findIndex(item=>item.id===id),1);
        }
        else{
            const time = new Date();
            const object = {
                id:id,
                method:method,
                poster_path:poster_path,
                title:title,
                release_date:release_date,
                vote_average:vote_average,
                time:time.getTime()
            }
            dataFavorite.push(object);
        }
        localStorage.setItem("dataFavorite",JSON.stringify(dataFavorite));
        return dataFavorite;
    },
}

export default ls;

