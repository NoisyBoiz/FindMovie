import React,{useState,useReducer} from "react"
import {useNavigate, Link } from "react-router-dom";
import "../style/login.css"
import {useTranslation} from 'react-i18next';
const initStateLogin = {
    emailSignin:"",
    passwordSignin:"",
    userNameSignup:"",
    emailSignup:"",
    passwordSignup:"",
    confirmPasswordSignup:"",
    checkemailSignin:false,
    checkpasswordSignin:false,
    checkuserNameSignup:false,
    checkemailSignup:false,
    checkpasswordSignup:false,
    checkconfirmPasswordSignup:false,
}
const reducerLogin = (state,action) => {
    switch(action.type){
        case "emailSignin":
            return {...state,emailSignin:action.value};
        case "passwordSignin":
            return {...state,passwordSignin:action.value};
        case "userNameSignup":
            return {...state,userNameSignup:action.value};
        case "emailSignup":
            return {...state,emailSignup:action.value};
        case "passwordSignup":
            return {...state,passwordSignup:action.value};
        case "confirmPasswordSignup":
            return {...state,confirmPasswordSignup:action.value};
        case "checkemailSignin":
            return {...state,checkemailSignin:action.value};
        case "checkpasswordSignin":
            return {...state,checkpasswordSignin:action.value};
        case "checkuserNameSignup":
            return {...state,checkuserNameSignup:action.value};
        case "checkemailSignup":
            return {...state,checkemailSignup:action.value};
        case "checkpasswordSignup":
            return {...state,checkpasswordSignup:action.value};
        case "checkconfirmPasswordSignup":
            return {...state,checkconfirmPasswordSignup:action.value};
        default:
            return state;
    }
}

function Login(){
    const [login,dispatch] = useReducer(reducerLogin,initStateLogin);
    const {t} = useTranslation();
    const [isSignin,setIsSignin] = useState(true);
    const [showPasswordSignin,setShowPasswordSignin] = useState(false);
    const [showPasswordSignup,setShowPasswordSignup] = useState(false);
    const navigate = useNavigate();
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const mailformat =  /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/igm;
        const userName = login.userNameSignup;
        const email = login.emailSignup;
        const password = login.passwordSignup;
        const confirmPassword = login.confirmPasswordSignup;
        if(userName===""||email===""||email.match(mailformat)===null||password===""||confirmPassword===""||password!==confirmPassword){
            if(userName===""){
                dispatch({type:"checkuserNameSignup",value:true})
            }
            if(email===""||email.match(mailformat)===null){
                dispatch({type:"checkemailSignup",value:true})
            }
            if(password===""){
                dispatch({type:"checkpasswordSignup",value:true})
            }
            if(confirmPassword===""){
                dispatch({type:"checkconfirmPasswordSignup",value:true})
            }
        }
        else{
        let result = await fetch(
        'http://localhost:3003/register', {
            method: "post",
            body: JSON.stringify({ userName, email, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result===200){
            alert("Data saved succesfully");
        }
        else if(result===404){
            alert("Email already exists");
        }
    }
    }
    const handleSignin = async (e) => {
        e.preventDefault();
        const email = login.emailSignin;
        const password = login.passwordSignin;
        if(email===""||password===""){
            if(email===""){
                dispatch({type:"checkemailSignin",value:true})
            }
            if(password===""){
                dispatch({type:"checkpasswordSignin",value:true})
            }
        }
        else{
            const url = "http://localhost:3003/get/"+email+"/"+password;
            let result = await fetch(
                url, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json();
                console.warn(result);
            if (result===404) alert("something went wrong");
            else{
                alert("Login succesfully");
                localStorage.setItem("user-info",JSON.stringify(result));
                navigate("/");
            }
        }
    }
    return(
        <>
        <div className="loginPage">
            <Link to="/"> <i className="fa-solid fa-arrow-left"></i> {t("Back to home")} </Link>
            <div className="signinContainer">
                <div className={`signinContent ${isSignin?"showSignin":"hiddenSignin"}`}>
                    <h1> {t("Sign In")} </h1>
                    <form action="">
                        <input className={login.checkemailSignin?"unMatch":"normalBorder"} type="email" placeholder="Email"  onChange={(e)=>{dispatch({type:"emailSignin",value:e.target.value})}} onClick={()=>{dispatch({type:"checkemailSignin",value:false})}}/>
                        <h5 className={login.checkemailSignin?"showAlert":"hiddenAlert"}> {t("Please enter a valid email address")}</h5>
                        <div className="passwordSignin">
                            <input className={login.checkpasswordSignin?"unMatch":"normalBorder"} type={showPasswordSignin?"text":"password"} placeholder={t("Password")}  onChange={(e)=>{dispatch({type:"passwordSignin",value:e.target.value})}} onClick={()=>{dispatch({type:"checkpasswordSignin",value:false})}}/> 
                            {showPasswordSignin?<i className="fa-solid fa-eye" onClick={()=>{setShowPasswordSignin(false)}}></i>:<i className="fa-solid fa-eye-slash" onClick={()=>{setShowPasswordSignin(true)}}></i>}
                        </div>
                        <h5 className={login.checkpasswordSignin?"showAlert":"hiddenAlert"}> {t("Please enter a valid password")}</h5>
                        <p>{t("Forgot your password?")} </p> 
                        <button onClick={(e)=>{handleSignin(e)}}> {t("Sign In")} </button>
                    </form>
                    <button className="bfMobi" onClick={()=>{setIsSignin(false)}}> {t("New user? Create account")} </button>
                </div>
            </div>
            <div className="signupContainer">
                <div className={`signupContent ${!isSignin?"showSignup":"hiddenSignup"}`}>
                    <h1> {t("Sign Up")} </h1>
                    <form action="">
                        <input className={login.checkuserNameSignup?"unMatch":"normalBorder"} type="text" placeholder={t("Name")} onChange={(e)=>{dispatch({type:"userNameSignup",value:e.target.value})}} onClick={()=>{dispatch({type:"checkuserNameSignup",value:false})}}/>
                        <h5 className={login.checkuserNameSignup?"showAlert":"hiddenAlert"}> {t("Please enter a valid name")} </h5>
                        <input className={login.checkemailSignup?"unMatch":"normalBorder"} type="email" placeholder="Email" onChange={(e)=>{dispatch({type:"emailSignup",value:e.target.value})}} onClick={()=>{dispatch({type:"checkemailSignup",value:false})}}/>
                        <h5  className={login.checkemailSignup?"showAlert":"hiddenAlert"}> {t("Please enter a valid email address")}</h5>
                        <div className="passwordSignup"> 
                            <input className={login.checkpasswordSignup?"unMatch":"normalBorder"} type={showPasswordSignup?"text":"password"} placeholder={t("Password")} onChange={(e)=>{dispatch({type:"passwordSignup",value:e.target.value})}} onClick={()=>{dispatch({type:"checkpasswordSignup",value:false})}}/> 
                            {showPasswordSignup?<i className="fa-solid fa-eye" onClick={()=>{setShowPasswordSignup(false)}}></i>:<i className="fa-solid fa-eye-slash" onClick={()=>{setShowPasswordSignup(true)}}></i>} 
                        </div>
                        <h5  className={login.checkpasswordSignup?"showAlert":"hiddenAlert"}> {t("Please enter a valid password")}</h5>
                        <input className={login.checkconfirmPasswordSignup?"unMatch":(login.confirmPasswordSignup!==""?(login.confirmPasswordSignup===login.passwordSignup?"match":"unMatch"):"normalBorder")} type={showPasswordSignup?"text":"password"} placeholder={t("Confirm Password")} onChange={(e)=>{dispatch({type:"confirmPasswordSignup",value:e.target.value})}} onClick={()=>{dispatch({type:"checkconfirmPasswordSignup",value:false})}}/> 
                        <h5  className={login.checkconfirmPasswordSignup?"showAlert":"hiddenAlert"}> {t("Please enter a valid password")}</h5>
                        <button onClick={(e)=>{handleOnSubmit(e)}}> {t("Sign Up")} </button>
                    </form>
                    <button className="bfMobi" onClick={()=>{setIsSignin(true)}}> {t("Already a User? Sign In")} </button>
                </div>  
            </div>
            <div className={`loginMask ${isSignin?"maskRight":"maskLeft"}`}> 
                <div className={`signupMaskContent ${!isSignin?"showSignupMask":"hiddenSignupMask"}`}> 
                    <h1> {t("Getting Started")} </h1>
                    <h3> {t("Create New Account")} </h3>
                    <button onClick={()=>{setIsSignin(true)}}> {t("Sign In")} <i className="fa-solid fa-angle-right"></i> </button>
                </div>
                <div className={`loginMaskContent ${!isSignin?"showSignupMask":"hiddenSignupMask"}`}>
                    <h1> {t("Hello Friend!")} </h1>
                    <h3>{t("Wellcome Back")} </h3>
                    <button onClick={()=>{setIsSignin(false)}}> <i className="fa-solid fa-angle-left"></i> {t("Sign Up")} </button>
                </div>
            </div>
        </div>
        </>
    )
}
export default Login;