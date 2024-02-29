const API_KEY = "your_api_key_here";

const movies = {
    async getData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;    
        } 
        catch (error) {
            console.error(error);
        }
    },

    async getMovies(type,language,pages) {
        let url = "https://api.themoviedb.org/3/"+type+"?api_key="+ API_KEY +"&language="+language+"&page="+pages;
        return await this.getData(url);
    },     
    async getDetails(type,id,language) {
        let url = "https://api.themoviedb.org/3/"+type+"/"+id+"?api_key="+ API_KEY +"&language="+language+"&append_to_response=videos,images,credits,reviews";
        return await this.getData(url);
    },
    async SearchMovie(query,language,page) {
        let url = "https://api.themoviedb.org/3/search/movie?api_key="+ API_KEY +"&query="+query+"&language="+language+"&page="+page;
        return await this.getData(url);
    },
    async FilterMovie(query,language,page) {
        let url = "https://api.themoviedb.org/3/discover/movie?api_key="+ API_KEY +query+"&language="+language+"&page="+page;
        return await this.getData(url);
    },
    async getTV(type,language, pages) {
        let url = "https://api.themoviedb.org/3/tv/"+type+"?api_key="+ API_KEY +"&language="+language+"&page="+pages;
        return await this.getData(url);
    }
}

export default movies;