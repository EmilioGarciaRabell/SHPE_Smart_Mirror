import React, { Component } from "react";
import PanelWrapper from "./PanelWrapper";
import { FaLaughBeam } from "react-icons/fa";

class JokeGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = { joke: "" };
  }

  setJoke = (apiResponse) => {
    this.setState({ joke: apiResponse["joke"] });
  };

  fetchJoke = () => {
    fetch("http://localhost:5000/api/joke")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        console.log("HTTP error:" + response.status + ":" + response.statusText);
        return { joke: "Failed to fetch joke." };
      })
      .then((jsonOutput) => {
        this.setJoke(jsonOutput);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetchJoke();
  }

  render() {
    const { onClose } = this.props;

    return (
      <PanelWrapper title="Random Joke" icon={<FaLaughBeam />} onClose={onClose}>
        <div className="joke oswald-light" style={{ color: "white", textAlign: "center" }}>
          <p style={{ marginBottom: '20px', textAlign: 'left', fontSize: '18px' }}>{this.state.joke}</p>
          <button
            onClick={this.fetchJoke}
            style={{
              backgroundColor: "#444",
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            New Joke
          </button>
        </div>
      </PanelWrapper>
    );
  }
}

export default JokeGenerator;
