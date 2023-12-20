import React, {useState, useEffect} from 'react'
import './style.css'

import { ScoreTable } from '../../components'

function Leaderboard() {
  const [scores, setScores]=useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/scores/token/${token}`);

        if (response.status === 200) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => b.value - a.value);
          setScores(sortedData);
        } else {
          throw new Error('Failed to fetch scores');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
        <h2>Leaderboard</h2>
        <div className="leaderboardContainer">
          <table className="leaderboardTable">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Subject</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) =><ScoreTable key={index} rank ={index+1} score={score} />)}
            </tbody>
          </table>
        </div>
    </>
  )
}

export default Leaderboard