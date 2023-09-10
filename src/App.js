import { useCallback, useEffect, useMemo, useState } from "react";
import { padsBankRight, padsBankLeft } from "./data";
import "./App.scss";

function App() {
  const [volume, setVolume] = useState(50);
  const [power, setPower] = useState(true);
  const [bank, setBank] = useState(false);
  const [display, setDisplay] = useState();

  const playSound = useCallback(
    (selector) => {
      const audio = document.getElementById(selector);
      if (audio) {
        const parent = audio.parentElement;
        // audio.currentTime = 0;
        if (power) {
          setDisplay(parent.id);
          audio.volume = volume / 100;
          audio.play();

          parent.setAttribute(
            "style",
            "background-color: orange; margin-top: 13px; box-shadow: 0px 3px orange; height: 77px"
          );
        } else {
          parent.setAttribute(
            "style",
            "margin-top: 13px; box-shadow: 0px 3px gray; height: 77px"
          );
        }
        setTimeout(() => {
          parent.style.backgroundColor = null;
          parent.style.marginTop = null;
          parent.style.boxShadow = null;
          parent.style.height = null;
        }, 200);
      }
    },
    [volume, power]
  );

  const keydownHandler = useCallback(
    (event) => {
      switch (event.key) {
        case "Q":
        case "W":
        case "E":
        case "A":
        case "S":
        case "D":
        case "Z":
        case "X":
        case "C":
          playSound(event.key);
          break;
        default:
          return;
      }
    },
    [playSound]
  );

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [keydownHandler]);

  const pads = useMemo(() => {
    return bank ? padsBankRight : padsBankLeft;
  }, [bank]);

  const powerHandler = () => {
    setPower((prev) => !prev);
  };

  const volumeHandler = (event) => {
    const volumeLevel = event.target.value;
    setVolume(volumeLevel);
    setDisplay(`Volume: ${volumeLevel}`);
    setTimeout(() => setDisplay(""), 1000);
  };

  const bankSelectHandler = () => {
    if (power) {
      setBank((prev) => !prev);
      setDisplay(bank ? "Heater Kit" : "Smooth Piano Kit");
    }
  };

  return (
    <div className="App">
      <div className="inner-container" id="drum-machine">
        <div className="pad-bank">
          {pads.map((elem) => {
            return (
              <div
                key={elem.id}
                className="drum-pad"
                id={elem.id}
                onClick={() => playSound(elem.text)}
              >
                <audio src={elem.src} className="clip" id={elem.text}></audio>
                {elem.text}
              </div>
            );
          })}
        </div>
        <div className="logo">
          <div className="inner-logo">FCC&nbsp;</div>
          <i className="inner-logo fa fa-free-code-camp"></i>
        </div>
        <div className="controls-container">
          <div className="control">
            <p>Power</p>
            <div className="select" onClick={powerHandler}>
              <div
                className="inner"
                style={power ? { float: "right" } : { float: "left" }}
              ></div>
            </div>
          </div>
          <p id="display">{display}&nbsp;</p>
          <div className="volume-slider">
            <input
              max="100"
              min="0"
              step="1"
              type="range"
              value={volume}
              onChange={(event) => volumeHandler(event)}
              disabled={!power}
            />
          </div>
          <div className="control">
            <p>Bank</p>
            <div className="select" onClick={bankSelectHandler}>
              <div
                className="inner"
                style={bank ? { float: "right" } : { float: "left" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
