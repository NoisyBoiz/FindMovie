import Home from '../pages/home';
import Theatres from '../pages/theatres';
import Detail from '../pages/detail';
import Search  from '../pages/search';
import TvShows from '../pages/tvShows';
import Setting from '../pages/setting';
import Collections from '../pages/collections';
import Login from '../pages/login';
export const publicRoutes = [
    {path:"/",layout:"Layout", component: Home},
    {path:"/theatres",layout:"Layout", component: Theatres},
    {path:"/detail/:method/:idMovie",layout:"Layout", component: Detail},
    {path:"/search/:isSearch/:query",layout:"Layout", component: Search},
    {path:"/tvshows/:method",layout:"Layout", component: TvShows},
    {path:"/collections",layout:"Layout", component: Collections},
    {path:"/setting",layout:"Layout", component: Setting},
    {path:"/login",layout:null, component: Login}
];