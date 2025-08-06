import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from "./navbar.jsx";
import listData from "../data/listData.jsx";
import DragScrolling from "../utils/dragScrolling.jsx";
import DarkMode from "../utils/darkMode.jsx";
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { MdLanguage } from 'react-icons/md';
import LocalStorage from "../utils/localStorage.jsx";
import "../style/header.css";


function Header() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    
    // State management
    const [showSlider, setShowSlider] = useState(false);
    const [showMenuMobi, setShowMenuMobi] = useState(false);
    const [indexGenres, setIndexGenres] = useState([]);
    const [showListCountry, setShowListCountry] = useState(false);
    const [indexCountry, setIndexCountry] = useState(null);
    const [showListSort, setShowListSort] = useState(false);
    const [indexSort, setIndexSort] = useState(null);
    const [directionSort, setDirectionSort] = useState(false);
    const [querySearchNavbar, setQuerySearchNavbar] = useState("");
    const [dropDownLanguage, setDropDownLanguage] = useState(false);
    const [userInfor, setUserInfor] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(LocalStorage.getDarkMode());
    const listLanguages = [
        { code: 'vi', name: t("Vietnamese") },
        { code: 'en', name: t("English") },
        { code: 'fr', name: t("French") },
        { code: 'ko', name: t("Korean") },
        { code: 'de', name: t("German") },
        { code: 'ru', name: t("Russian") },
        { code: 'ja', name: t("Japanese") },
        { code: 'zh', name: t("Chinese") },
        { code: 'es', name: t("Spanish") },
        { code: 'pt', name: t("Portuguese") },
        { code: 'hi', name: t("Hindi") },
        { code: 'th', name: t("Thai") },
        { code: 'ar', name: t("Arabic") }
    ];

    // Refs
    const sliderRef = useRef(null);
    const menuMobiRef = useRef(null);
    const languageRef = useRef(null);

    // Optimized event handlers with useCallback
    const handleOutsideClick = useCallback((e) => {
        if (sliderRef.current && !sliderRef.current.contains(e.target)) {
            setShowSlider(false);
        }
        if (menuMobiRef.current && !menuMobiRef.current.contains(e.target)) {
            setShowMenuMobi(false);
        }
        if (languageRef.current && !languageRef.current.contains(e.target)) {
            setDropDownLanguage(false);
        }
    }, []);

    const handleGenreUpdate = useCallback((genreIndex) => {
        setIndexGenres(prev => 
            prev.includes(genreIndex) 
                ? prev.filter(item => item !== genreIndex)
                : [...prev, genreIndex]
        );
    }, []);

    const handleSearch = useCallback(() => {
        if (querySearchNavbar === "") return;
        document.getElementsByName('searchInput')[0].value = "";
        navigate('/search/1/' + querySearchNavbar);
    }, [querySearchNavbar, navigate]);

    const handleFilter = useCallback(() => {
        if (indexGenres.length === 0 && indexCountry === null && indexSort === null) return;
        
        let arrGenres = [];
        for (let i = 0; i < indexGenres.length; i++) {
            arrGenres.push(listData.genres[indexGenres[i]].id);
        }

        let url = (indexGenres.length ? "&with_genres=" + arrGenres.join(",") : "") + 
                  (indexCountry != null ? "&region=" + listData.country[indexCountry].sign : "") + 
                  (indexSort != null ? "&sort_by=" + listData.sort[indexSort].method + (directionSort ? ".asc" : ".desc") : "");
        
        navigate('/search/0/' + url);
    }, [indexGenres, indexCountry, indexSort, directionSort, navigate]);

    const handleLanguageChange = useCallback((languageCode) => {
        i18n.changeLanguage(languageCode);
        LocalStorage.setLanguage(languageCode);
        setDropDownLanguage(false);
    }, [i18n]);

    const handleDarkModeToggle = useCallback((mode) => {
        setIsDarkMode(mode);
        LocalStorage.setDarkMode(mode.toString());
        DarkMode(mode);
    }, []);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }, [handleSearch]);

    const getUserInfor = useCallback(() => {
        const userInfor = localStorage.getItem("user-info") 
            ? JSON.parse(localStorage.getItem("user-info")) 
            : null;
        if (userInfor !== null) setUserInfor(userInfor);
    }, []);

    // Effects
    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [handleOutsideClick]);

    useEffect(() => {
        getUserInfor();
    }, [getUserInfor]);
   
    return (
        <>
            <div 
                className={`header-overlay ${(showSlider || showMenuMobi) ? "header-overlay--visible" : "header-overlay--hidden"}`}
                aria-hidden="true"
            />
            <header className="header" role="banner">
                <div className="header__container">
                    {/* Mobile Menu */}
                    <nav className="header__mobile-menu" ref={menuMobiRef} role="navigation" aria-label="Mobile navigation">
                        <button 
                            className="header__mobile-menu-toggle fa-solid fa-bars" 
                            onClick={() => setShowMenuMobi(!showMenuMobi)}
                            aria-label={showMenuMobi ? "Close mobile menu" : "Open mobile menu"}
                            aria-expanded={showMenuMobi}
                        />
                        <div className={`header__mobile-navbar ${showMenuMobi ? "header__mobile-navbar--visible" : "header__mobile-navbar--hidden"}`}>
                            <Navbar />
                        </div>
                    </nav>

                    {/* Logo */}
                    <div className="header__logo">
                        <Link to="/" aria-label="FindMovie home page">
                            <h1><span>MO</span><span>VIE</span></h1>
                        </Link>
                    </div>

                    {/* Search and Filter Container */}
                    <div ref={sliderRef} className="header__search-container">
                        <div className="header__search-input" role="search">
                            <button 
                                onClick={handleSearch} 
                                className="header__search-button fa-solid fa-magnifying-glass"
                                aria-label="Search movies"
                                type="button"
                            />
                            <input 
                                type="text" 
                                name="searchInput" 
                                placeholder={t("Search")} 
                                onChange={(e) => setQuerySearchNavbar(e.target.value)} 
                                onKeyDown={handleKeyPress}
                                aria-label="Search movies input"
                            />
                            <button 
                                className="header__filter-toggle fa-solid fa-sliders" 
                                onClick={() => setShowSlider(!showSlider)}
                                aria-label={showSlider ? "Hide filters" : "Show filters"}
                                aria-expanded={showSlider}
                                type="button"
                            />
                        </div>

                        {/* Filter Panel */}
                        <div className={showSlider ? "header__filter-panel--visible" : "header__filter-panel--hidden"} role="region" aria-label="Filter options">
                            <button className="header__filter-apply-btn" onClick={handleFilter} type="button">
                                {t("Filter")}
                            </button>

                            {/* Sort Options */}
                            <div 
                                className="header__sort-section" 
                                onMouseEnter={() => setShowListSort(true)} 
                                onMouseLeave={() => setShowListSort(false)}
                            >
                                <p className={indexSort != null ? "header__sort-btn--active" : "header__sort-btn--inactive"}>
                                    {indexSort == null ? t("Arrange") : t(listData.sort[indexSort].name)}
                                    <button
                                        className={`header__sort-direction fa-solid fa-arrow-down ${directionSort ? "header__sort-direction--up" : "header__sort-direction--down"}`}
                                        onClick={() => setDirectionSort(!directionSort)}
                                        aria-label={directionSort ? "Sort descending" : "Sort ascending"}
                                        type="button"
                                    />
                                    <button 
                                        className={`header__sort-clear ${indexSort == null ? "header__sort-clear--hidden" : "header__sort-clear--visible"}`} 
                                        onClick={() => setIndexSort(null)}
                                        aria-label="Clear sort selection"
                                        type="button"
                                    >
                                        +
                                    </button>
                                </p>
                                <div className={showListSort ? "header__sort-list--visible" : "header__sort-list--hidden"}>
                                    <ul role="listbox" aria-label="Sort options">
                                        {listData.sort.map((item, index) => (
                                            <li 
                                                key={index} 
                                                className={indexSort === index ? "header__sort-option--selected" : "header__sort-option--unselected"} 
                                                onClick={() => setIndexSort(indexSort !== index ? index : null)}
                                                role="option"
                                                aria-selected={indexSort === index}
                                            >
                                                {t(item.name)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Genres Filter */}
                            <div className="header__genres-section">
                                <p className={indexGenres.length ? "header__genres-btn--active" : "header__genres-btn--inactive"}>
                                    <span>{indexGenres.length}</span> {t("Genres")}
                                    <button 
                                        className={`header__genres-clear ${indexGenres.length ? "header__genres-clear--visible" : "header__genres-clear--hidden"}`} 
                                        onClick={() => setIndexGenres([])}
                                        aria-label="Clear genre selection"
                                        type="button"
                                    >
                                        +
                                    </button>
                                </p>
                                <div className="header__genres-list" onMouseDown={(e) => DragScrolling(e, "listGenres")}>
                                    <ul role="group" aria-label="Movie genres">
                                        {listData.genres.map((item, index) => (
                                            <li 
                                                key={index} 
                                                className={indexGenres.includes(index) ? "header__genre-item--selected" : "header__genre-item--unselected"} 
                                                onClick={() => handleGenreUpdate(index)}
                                                role="checkbox"
                                                aria-checked={indexGenres.includes(index)}
                                            >
                                                {t(item.name)}
                                                <span className={indexGenres.includes(index) ? "header__genre-icon--selected" : "header__genre-icon--unselected"}>
                                                    +
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Country Filter */}
                            <div 
                                className="header__country-section" 
                                onMouseEnter={() => setShowListCountry(true)} 
                                onMouseLeave={() => setShowListCountry(false)}
                            >
                                <p className={indexCountry == null ? "header__country-btn--inactive" : "header__country-btn--active"}>
                                    {indexCountry == null ? t("Country") : t(listData.country[indexCountry].name)}
                                    <button 
                                        className={`header__country-clear ${indexCountry == null ? "header__country-clear--hidden" : "header__country-clear--visible"}`} 
                                        onClick={() => setIndexCountry(null)}
                                        aria-label="Clear country selection"
                                        type="button"
                                    >
                                        +
                                    </button>
                                </p>
                                <div className={`header__country-list ${showListCountry ? "header__country-list--visible" : "header__country-list--hidden"}`}>
                                    <ul role="listbox" aria-label="Countries">
                                        {listData.country.map((item, index) => (
                                            <li 
                                                key={index} 
                                                className={indexCountry === index ? "header__country-option--selected" : "header__country-option--unselected"} 
                                                onClick={() => setIndexCountry(indexCountry !== index ? index : null)}
                                                role="option"
                                                aria-selected={indexCountry === index}
                                            >
                                                {t(item.name)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* User Settings and Language */}
                    <div className="header__user-section">
                        <div className="header__settings">
                            {/* Language Dropdown */}
                            <div className="header__language-dropdown" ref={languageRef}>
                                <button 
                                    className="header__language-toggle" 
                                    onClick={() => setDropDownLanguage(!dropDownLanguage)}
                                    aria-label="Select language"
                                    aria-expanded={dropDownLanguage}
                                    type="button"
                                >
                                    <MdLanguage />
                                </button>
                                <div 
                                    className={dropDownLanguage ? "header__language-menu--visible" : "header__language-menu--hidden"}
                                    role="menu"
                                    aria-label="Language options"
                                >
                                    <ul>
                                        {listLanguages.map((language, index) => (
                                            <li 
                                                key={index} 
                                                className={LocalStorage.getLanguage() === language.code ? "header__language-option--active" : "header__language-option--inactive"} 
                                                onClick={() => handleLanguageChange(language.code)}
                                                role="menuitem"
                                            >
                                                {t(language.name)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Dark Mode Toggle */}
                            <div className="header__dark-mode">
                                {!isDarkMode ? (
                                    <button 
                                        className="header__dark-mode-btn--light" 
                                        onClick={() => handleDarkModeToggle(true)}
                                        aria-label="Switch to dark mode"
                                        type="button"
                                    >
                                        <BsMoonFill />
                                    </button>
                                ) : (
                                    <button 
                                        className="header__dark-mode-btn--dark" 
                                        onClick={() => handleDarkModeToggle(false)}
                                        aria-label="Switch to light mode"
                                        type="button"
                                    >
                                        <BsSunFill />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* User Login/Profile
                        <div className="header__auth">
                            {userInfor !== null ? (
                                <div className="header__user-profile">
                                    <span className="header__user-icon" aria-hidden="true">
                                        <BiUserCircle />
                                    </span>
                                    <span>{userInfor.name}</span>
                                </div>
                            ) : (
                                <Link to="/login" className="header__login-btn" aria-label="Sign in to your account">
                                    <span className="header__user-icon" aria-hidden="true">
                                        <BiUserCircle />
                                    </span>
                                    <span>{t("Sign In")}</span>
                                </Link>
                            )}
                        </div> */}
                    </div>
                </div>
            </header>
        </>
    );
}
export default Header