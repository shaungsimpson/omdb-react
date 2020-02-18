import React, { useState , useEffect } from "react";

const DEFAULT_PLACEHOLDER_IMAGE =
  "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg";


const Movie = ({ movie }) => {
  const poster =
    movie.Poster === "N/A" ? DEFAULT_PLACEHOLDER_IMAGE : movie.Poster;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [details, updateDetails] = useState({
    Plot: "Loading description..."
  })

  // useEffect functions like componentDidMount if second var passed is an empty array, running only the first time it loads.
  useEffect( () => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`)
      .then( response =>  response.json() )
      .then( data => {
        updateDetails(data)
      });

  }, [])

  let description = details.Plot
  return (
    <div className="movie">
      <div className="img-container">
        <img
          width="200"
          alt={`The movie titled: ${movie.Title}`}
          src={poster}
        />
      </div>
      <div className="movie-text">
        <h2>{movie.Title}</h2>
        <span className="capitalise">{movie.Type}<br />
        <strong>Released:</strong> {movie.Year}<br />
        <strong>Rated:</strong> {details.Rated}</span>
        <p>{description}</p>
        <div className="movie-meta">
          <strong>Director:</strong> {details.Director}<br/>
          <strong>Actors:</strong> {details.Actors}<br/>
          <strong>Production:</strong> {details.Production}
        </div>
      </div>
    </div>
  );
};


export default Movie;