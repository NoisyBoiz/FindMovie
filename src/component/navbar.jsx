import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "../style/navbar.css";

function Navbar() {
    const { t } = useTranslation();
    const location = useLocation();
    const [showMenuTVShow, setShowMenuTVShow] = useState(false);
    const [focusNavbar, setFocusNavbar] = useState("home");

    // Extract navigation logic into a separate function for better maintainability
    const determineActiveNavbar = useCallback(() => {
        const pathSegments = location.pathname.split("/");
        const firstSegment = pathSegments[1];
        
        if (!firstSegment || firstSegment === "") {
            return "home";
        } else if (firstSegment === "tvshows") {
            return pathSegments[2] || "popular";
        } else {
            return firstSegment;
        }
    }, [location.pathname]);

    // Update active navbar when location changes
    useEffect(() => {
        const activeSection = determineActiveNavbar();
        setFocusNavbar(activeSection);
    }, [determineActiveNavbar]);

    // // Memoize logout handler
    // const handleLogout = useCallback(() => {
    //     try {
    //         localStorage.removeItem("user-info");
    //         window.location.reload();
    //     } catch (error) {
    //         console.error("Error during logout:", error);
    //     }
    // }, []);

    // Memoize TV show menu handlers
    const handleShowTVMenu = useCallback(() => {
        setShowMenuTVShow(true);
    }, []);

    const handleHideTVMenu = useCallback(() => {
        setShowMenuTVShow(false);
    }, []);

    // Memoize navbar click handler
    const handleNavbarClick = useCallback((section) => {
        setFocusNavbar(section);
        setShowMenuTVShow(false); // Close TV menu when clicking other items
    }, []);
    
    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <ul className="navbar__list">
                <li>
                    <Link 
                        to="/" 
                        aria-label="Go to Home page"
                        className={`navbar__item ${focusNavbar === "home" ? "active" : "inactive"}`} 
                        onClick={() => handleNavbarClick("home")}
                    >
                        <i className="navbar__icon fa-solid fa-house" aria-hidden="true"></i>
                        <span className="navbar__text">{t("Home")}</span>
                    </Link>
                </li>

                <li>
                    <Link 
                        to="/theatres" 
                        aria-label="Go to Theatres page"
                        className={`navbar__item ${focusNavbar === "theatres" ? "active" : "inactive"}`} 
                        onClick={() => handleNavbarClick("theatres")}
                    >
                        <i className="navbar__icon fa-solid fa-ticket" aria-hidden="true"></i>
                        <span className="navbar__text">{t("Theatres")}</span>
                    </Link>
                </li>

                <li 
                    className={`navbar__dropdown ${(focusNavbar === "popular" || focusNavbar === "topRate" || focusNavbar === "airingToday" || focusNavbar === "onTheAir") ? "active" : "inactive"}`} 
                    onMouseEnter={handleShowTVMenu} 
                    onMouseLeave={handleHideTVMenu}
                    aria-haspopup="true"
                    aria-expanded={showMenuTVShow}
                >
                    <span className="navbar__dropdown-toggle">
                        <i className="navbar__icon fa-solid fa-tower-cell" aria-hidden="true"></i>
                        <span className="navbar__text">{t("TV Shows")}</span>
                        <i className="navbar__dropdown-arrow fa-solid fa-angle-down" aria-hidden="true"></i>
                    </span>
                    <ul 
                        className={`navbar__dropdown-menu ${showMenuTVShow ? "visible" : "hidden"}`}
                        role="menu"
                        aria-label="TV Shows submenu"
                    >
                        <li>
                            <Link to="/tvshows/popular" aria-label="Go to Popular TV Shows">
                                <span 
                                    className={`navbar__dropdown-item ${focusNavbar === "popular" ? "active" : "inactive"}`} 
                                    onClick={() => handleNavbarClick("popular")}
                                >
                                    {t("Popular")}
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tvshows/top_rated" aria-label="Go to Top Rated TV Shows">
                                <span 
                                    className={`navbar__dropdown-item ${focusNavbar === "topRate" ? "active" : "inactive"}`} 
                                    onClick={() => handleNavbarClick("topRate")}
                                >
                                    {t("Top Rated")}
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tvshows/airing_today" aria-label="Go to Airing Today TV Shows">
                                <span 
                                    className={`navbar__dropdown-item ${focusNavbar === "airingToday" ? "active" : "inactive"}`} 
                                    onClick={() => handleNavbarClick("airingToday")}
                                >
                                    {t("Airing Today")}
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tvshows/on_the_air" aria-label="Go to On The Air TV Shows">
                                <span 
                                    className={`navbar__dropdown-item ${focusNavbar === "onTheAir" ? "active" : "inactive"}`} 
                                    onClick={() => handleNavbarClick("onTheAir")}
                                >
                                    {t("On The Air")}
                                </span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <Link 
                        to="/collections" 
                        aria-label="Go to Collections page"
                        className={`navbar__item ${focusNavbar === "collections" ? "active" : "inactive"}`} 
                        onClick={() => handleNavbarClick("collections")}
                    >
                        <i className="navbar__icon fa-solid fa-inbox" aria-hidden="true"></i>
                        <span className="navbar__text">{t("Collections")}</span>
                    </Link>
                </li>
            </ul>

        {/* <button 
                className="navbar__logout" 
                onClick={handleLogout}
                aria-label="Log out from application"
                type="button"
            >
                <i className="navbar__icon fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                <span className="navbar__text">{t("Log Out")}</span>
            </button> */}
        </nav>
    );
}
export default Navbar