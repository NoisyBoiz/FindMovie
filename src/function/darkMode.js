// this function is used to change the color of the website when the user clicks on the dark mode button
function Dark(isDark){
    var r = document.querySelector(':root');
        if(isDark) {
            r.style.setProperty("--colorBgBody","rgb(33, 33, 33)");
            r.style.setProperty("--colorTextWhite","rgb(242, 242, 242)");
            r.style.setProperty("--colorTextWhite2","rgb(200, 200, 200)");
            r.style.setProperty("--colorTextBlack","rgb(18, 18, 18)");
            /* header */

            r.style.setProperty("--colorBgHeader","rgb(18,18,18)");
            r.style.setProperty("--colorBgInputSearch","rgb(5,5,5)");
            r.style.setProperty("--colorBorderSearch","rgba(255, 255, 255, 0.3)");
            r.style.setProperty("--colorBgContainerSlider","rgb(25,30,35)");
            r.style.setProperty("--colorBgDropNavbar","rgb(35, 40, 50)");
            r.style.setProperty("--colorBgSlider","rgb(35, 45, 60)");
            r.style.setProperty("--colorBgListSlider","rgb(15, 45, 85)");
            r.style.setProperty("--colorBgSliderGenres","rgb(35, 40, 50)");
            r.style.setProperty("--colorFocusSlider","rgb(120, 25, 25)");

            /* detail */
            r.style.setProperty("--colorBgDetail","rgba(20, 20, 35, 0.4)");
            r.style.setProperty("--colorBgEmpty","rgb(26, 26, 46)");
            r.style.setProperty("--colorTextEmpty","rgb(20, 100, 150)");
            r.style.setProperty("--colorTextShadow","rgb(0, 0, 0)");
            r.style.setProperty("--colorBgComment","rgb(30, 30, 55)");
            r.style.setProperty("--colorBgCommentFocus","rgb(40, 40, 60)");
            r.style.setProperty("--colorShadowComment","rgba(15,15,30,0.8)");
            /* footer */
            r.style.setProperty("--colorBgFooter","rgb(35, 40, 50)");
            r.style.setProperty("--colorTextGray","rgb(145, 145, 145)");
            r.style.setProperty("--colorSocial","rgb(120, 120, 120)");
            /* commnon */
            r.style.setProperty("--colorButtonWhite","rgb(230, 230, 230)");
            r.style.setProperty("--colorBgPagination","rgb(40, 45, 60)");
            r.style.setProperty("--colorButtonDisabled","rgb(50, 70, 95)");
            r.style.setProperty("--colorTextDisabled","rgb(40, 80, 120)");
            r.style.setProperty("--colorBgInput","rgb(60, 60, 70)");
            r.style.setProperty("--colorBorderWhite","rgb(140, 140, 140)");
            r.style.setProperty("--colorBorderGray","rgb(58, 58, 58)");
            /* login */
            r.style.setProperty("--colorFocusLogin","rgb(20, 40, 55)");
        }
        else {
            r.style.setProperty("--colorBgBody","rgb(230, 230, 230)");
            r.style.setProperty("--colorTextWhite","rgb(25, 30, 30)");
            r.style.setProperty("--colorTextWhite2","rgb(60, 60, 60)");
            r.style.setProperty("--colorTextBlack","rgb(242, 242, 242)");
            /* header */
            r.style.setProperty("--colorBgHeader","rgb(245,245,245)");
            r.style.setProperty("--colorBorderSearch","rgba(18, 18, 18, 0.3)");
            r.style.setProperty("--colorBgInputSearch","rgb(255,255,255)");
            r.style.setProperty("--colorBgContainerSlider","rgb(243, 248, 255)");
            r.style.setProperty("--colorBgDropNavbar","rgb(220, 220, 220)");
            r.style.setProperty("--colorBgSlider","rgb(198, 207, 255)");
            r.style.setProperty("--colorBgListSlider","rgb(222, 236, 255)");
            r.style.setProperty("--colorBgSliderGenres","rgb(240, 240, 240)");
           
            r.style.setProperty("--colorFocusSlider","rgb(255, 109, 96)");

            /* detail */
            r.style.setProperty("--colorBgDetail","rgba(235, 235, 235, 0.5)");
            r.style.setProperty("--colorBgEmpty","rgb(225, 225, 230)");
            r.style.setProperty("--colorTextEmpty","rgb(255, 99, 99)");
            r.style.setProperty("--colorTextShadow","rgb(140, 140, 140)");
            r.style.setProperty("--colorBgComment","rgb(240, 240, 240)");
            r.style.setProperty("--colorBgCommentFocus","rgb(255, 255, 255)");
            r.style.setProperty("--colorShadowComment","rgb(140, 140, 140)");
            /* footer */
            r.style.setProperty("--colorBgFooter","rgb(250, 250, 250)");
            r.style.setProperty("--colorTextGray","rgb(25, 25, 25)");
            r.style.setProperty("--colorSocial","rgb(170, 170, 170)");
            /* commnon */
            r.style.setProperty("--colorButtonWhite","rgb(250, 180, 180)");
            r.style.setProperty("--colorBgPagination","rgb(200, 200, 210)");
            r.style.setProperty("--colorButtonDisabled","rgb(200, 200, 210)");
            r.style.setProperty("--colorTextDisabled","rgb(210, 210, 220)");
            r.style.setProperty("--colorBgInput","rgb(230, 230, 240)");
            r.style.setProperty("--colorBorderWhite","rgb(15, 15, 15)");
            r.style.setProperty("--colorBorderGray","rgb(195, 195, 195)");
            r.style.setProperty("--colorFocusLogin","rgb(210, 210, 220)");
        }
}
export default Dark;