// this function is used to drag scrolling the slider
function DragScrolling(e,x){
    const slider = document.getElementsByClassName(x)[0];
    if(slider!==undefined){
        e.preventDefault();
        let startX = e.pageX - slider.offsetLeft;
        let scrollLeft = slider.scrollLeft;
        let isDown = true;
        const handleMouseMove = (e) => {
            if(isDown!==true) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX)*1.9;
            slider.scrollLeft = scrollLeft - walk;
        }
        slider.addEventListener('mouseleave', () => {isDown=false});
        slider.addEventListener('mouseup', () => {isDown=false});
        slider.addEventListener("mousemove", handleMouseMove);
    }
}
export default DragScrolling;