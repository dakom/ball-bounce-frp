import * as React from "react";

const style = {
    color: "#fff",
    fontFamily: "Verdana, Arial",
    fontSize: "40px",
    width: "100%",
    cursor: "pointer",
    borderRadius: "15px",
    margin: "10px",
    padding: "5px",
    textAlign: "center",
    border: "4px solid #fff"
}

const styleGreen = Object.assign({}, style, {backgroundColor: "green" }); 
const styleRed = Object.assign({}, style, {backgroundColor: "red"}); 


export const Waiting = ({onClick}) => (
    <div style={styleGreen} onClick={onClick} >Drop</div>
);

export const Bouncing = ({onClick}) => (
    <div style={styleRed} onClick={onClick} >Pause</div>
)
