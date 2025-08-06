const API_KEY = process.env.REACT_APP_API_KEY;

const PREFIX = "https://api.themoviedb.org/3/";

const movies = {
    async getData(url) {
        try {
            // Check if API key is available
            if (!API_KEY) {
                throw new Error('API key is not configured. Please check your .env file.');
            }

            const response = await fetch(PREFIX + url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            return data;    
        } catch (error) {
            console.error("API Error:", error.message);
            throw error; // Re-throw to allow calling code to handle
        }
    },

    async getMovies(type,language,pages) {
        let url = `${type}?api_key=${API_KEY}&language=${language}&page=${pages}`;
        return await this.getData(url);
    },     
    async getDetails(type,id,language) {
        let url = `${type}/${id}?api_key=${API_KEY}&language=${language}&append_to_response=videos,images,credits,reviews`;
        return await this.getData(url);
    },
    async searchMovie(query,language,page) {
        let url = `search/movie?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`;
        return await this.getData(url);
    },
    async filterMovie(query,language,page) {
        let url = `discover/movie?api_key=${API_KEY}&${query}&language=${language}&page=${page}`;
        return await this.getData(url);
    },
    async getTV(type,language, pages) {
        let url = `tv/${type}?api_key=${API_KEY}&language=${language}&page=${pages}`;
        return await this.getData(url);
    }
}

export default movies;