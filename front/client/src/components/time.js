const Time = () =>{

    const currTime = new Date().toLocaleTimeString;
    
    return(
        <div>
           {currTime} 
        </div>
    )
}

export default Time;





