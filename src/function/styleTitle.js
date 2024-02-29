// this function is used to style the title of the book
import ToCapitalize from "./toCapitalize";
function StyleTitle(title){
    title = title.toLowerCase();
    const showTitle1 = (x,y)=>{
        return (<> <h1 className="styleBDTitle1"> {x} </h1> <h1 className="styleBDTitle2"> {y} </h1> </>);
    }
    const searchString = (n,en,st) => {
        let x = ToCapitalize(title.slice(0,n+en));
        let y = ToCapitalize(title.slice(n+st).trimStart());
        return showTitle1(x,y);
    }
    if(title.search(":")!==-1) return searchString(title.search(":"),0,1);
    if(title.search("of")!==-1) return searchString(title.search("of"),2,3);
    if(title.lastIndexOf("and")!==-1) return searchString(title.lastIndexOf("and"),3,3);
    if(title.lastIndexOf("&")!==-1) return searchString(title.lastIndexOf("&"),0,0);
    if(title.lastIndexOf("the")!==-1) return searchString(title.lastIndexOf("the"),3,3);
    else return <h1 className="styleBDTitle2"> {ToCapitalize(title)} </h1>;
}
export default StyleTitle;