import React, { Component } from "react";

class JokeGenerator extends Component{
    constructor(props){
        super(props);
        this.state = {joke: ""}
    }

    setJoke = (apiResponse) =>{
       this.setState({joke: apiResponse['joke']});
    }

    fetchJoke = () =>{
        fetch("http://localhost:5000/joke").then(
            (response) => {
                if (response.status === 200){
                    return (response.json());
                }
                console.log("HTTP error:" + response.status + ":" + response.statusText);
                return {joke: "Failed to fetch joke."};
            }
        ).then((jsonOutput) => {
            this.setJoke(jsonOutput);
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount(){
        this.fetchJoke();
    }

    render(){
        return (
            <div className="joke oswald-light">
                <h1>Random Joke</h1>
                <p>{this.state.joke}</p>
                <button onClick={this.fetchJoke}>New Joke</button>
            </div>
        )
    }
}

export default JokeGenerator;