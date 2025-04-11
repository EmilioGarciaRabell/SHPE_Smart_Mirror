

const CurrentDate = () =>{

    const currDate = new Date().toLocaleDateString;
    return(
        <div>
           {currDate} 
        </div>
    )
}

export default CurrentDate;
