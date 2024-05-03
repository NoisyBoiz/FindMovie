import React from 'react'
import {useTranslation} from 'react-i18next';
import '../style/footer.css'

function Footer(){
    const {t} = useTranslation();
    return(
        <>
        <div className='footerContainer'> 
            <div className="footerTop"> 
                    <h2><span>MO</span><span>VIE</span></h2>
            </div>
            <div className="footerContent">
                <div className="footerPages">
                    <h5> {t("Pages")} </h5>
                    <ul> 
                        <li>{t("Website")}</li>
                        <li>{t("Blog")}</li>
                        <li>{t("News")}</li>
                        <li>{t("Products")}</li>
                        <li>{t("Event")}</li>
                    </ul>
                </div>
                <div className="footerAboutUs">
                    <h5> {t("About Us")} </h5>
                    <ul> 
                        <li>{t("Team")}</li>
                        <li>{t("Careers")}</li>
                        <li>{t("FAQ")}</li>
                        <li>{t("Forum")}</li>
                        <li>{t("Activity")}</li>
                    </ul>
                </div>
                <div className="footerWatch">
                    <h5> {t("Watch")} </h5>
                    <ul> 
                        <li>{t("Movies")}</li>
                        <li>{t("Series")}</li>
                        <li>{t("TV Shows")}</li>
                        <li>{t("Category")}</li>
                        <li>{t("Watchlist")}</li>
                    </ul>
                </div>
                <div className="footerContact">
                    <h5> {t("Contact Us")} </h5>
                    <ul>
                        <li><i className="fa-solid fa-location-dot"></i> {t("Address")}: 123 {t("Street")}, {t("City")}, {t("Country")} </li>
                        <li><i className="fa-solid fa-phone"></i>{t("Phone")}: +0123456789</li>
                        <li><i className="fa-solid fa-envelope"></i>Email: someone@gmail.com  </li>
                        <div className='footerInput'>
                            <input type="text" placeholder={t("Contact Us")}></input>
                            <button> <i className="fa-regular fa-paper-plane"></i> </button>
                        </div>
                    </ul>
                    
                </div>
            </div>
            <div className='footerBottom'> 
                <div className="footerCopyRight">
                    Copyright <i className="fa-regular fa-copyright"></i> All right reserved | Made by NB
                </div>
                <div className="footerSocial">
                    <i className="fa-brands fa-facebook-f"></i>
                    <i className="fa-brands fa-twitter"></i>
                    <i className="fa-solid fa-comments"></i>
                    <i className="fa-brands fa-instagram"></i>
                    <i className="fa-solid fa-globe"></i>
                </div>
            </div>
        </div>
        </>
    )
}

export default Footer