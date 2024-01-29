import React, {useState, useEffect} from 'react'
import StopWatchButton from './StopWatchButton'

export default function StopWatch() {
    const [isTimeRunning, setIsTimeRunning] = useState(false);
    const [elapsedMilliSecond, setElapsedMilliSecond] = useState(0);
    const [isLapClicked, setIsLapClicked] = useState(false);
    const [lapElaspedMilliSecond, setLapElapsedMilliSecond] = useState(0);
    const [lapList, setLapList] = useState([]);
    
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        let lapInterval: NodeJS.Timeout | null = null;

        if(isTimeRunning == true) {
        interval = setInterval(() => {
            setElapsedMilliSecond(prevElapsedMilliSec => prevElapsedMilliSec + 10);
        }, 10);

        if(isLapClicked == true) {
            console.log(formatMilliSeconds(lapElaspedMilliSecond));
            setLapList(currLapList => {
            return [formatMilliSeconds(lapElaspedMilliSecond), ...currLapList]
            })
            setLapElapsedMilliSecond(0);
            setIsLapClicked(false);
        }

        lapInterval = setInterval (() => {
            setLapElapsedMilliSecond(prevElapsedMilliSec => prevElapsedMilliSec + 10);
        }, 10)
        } 

        return () => {
        clearInterval(interval);
        clearInterval(lapInterval);
        }

    }, [isTimeRunning, isLapClicked]);

    function formatMilliSeconds(milliSecond: number) {
        let second = Math.floor(milliSecond/1000);
        let minute = Math.floor(second/60);
        let hour = Math.floor(minute/60);
        let hundrethSecond = (milliSecond/10)%100; 
        let hundrethSecondFormat = hundrethSecond < 10? `0${hundrethSecond}` : hundrethSecond;

        return `${hour}h : ${minute % 60}m : ${second % 60}s.${hundrethSecondFormat}`;
    }

    function displayLapTable() {
        return lapList.map((lap, i) => {
          return ( 
            <tr>
              <td>{lapList.length-i}</td>
              <td>{lap}</td>
            </tr>)
        })
    }
    
    function handleReset() {
        setElapsedMilliSecond(0);
        setIsTimeRunning(false);
        setLapElapsedMilliSecond(0);
        setLapList([]);
    }

    return(
        <div>
            <div className="stopwatchContainer">
                <div className="displayContainer"> 
                    <h1>{formatMilliSeconds(elapsedMilliSecond)}</h1> 
                </div>
                <div className="lapDisplay">Lap: {formatMilliSeconds(lapElaspedMilliSecond)}</div>
                <div className="buttonContainer">
                    {!isTimeRunning && <StopWatchButton className="startButton" onClick={() => setIsTimeRunning(true)} label={elapsedMilliSecond == 0 ? "Start" : "Resume"}/>}
                    {isTimeRunning && <StopWatchButton className="lapButton" onClick={() => isTimeRunning && setIsLapClicked(true)} label="Lap"/>}
                    {isTimeRunning && <StopWatchButton className="stopButton" onClick={() => setIsTimeRunning(false)} label="Stop"/>}
                    {<StopWatchButton className="resetButton" onClick={() => handleReset()} label="Reset"/>}
                </div>
            </div>

            <div className="lapTableContainer">
                {lapList.length > 0 && <table className="lapTable">
                <thead>
                    <tr>
                    <th>Lap No.</th>
                    <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {displayLapTable()}
                </tbody>
                </table>}
            </div>                   
        </div>
    )
}
