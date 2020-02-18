import React, { useReducer, useEffect } from 'react';
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Pagination from "./Pagination";
import Search from "./Search";

const API_KEY = process.env.REACT_APP_API_KEY;
const MOVIE_API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=man`;

const initialState = {
  loading: true,
  movies: [],
  total: null,
  errorMessage: null,
  page: 1
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
        total: action.total
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {

      fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {

          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search,
            total: jsonResponse.totalResults
          });

        });
    }, []);

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchValue}&page=${state.page}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search,
            total: jsonResponse.totalResults
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            payload: jsonResponse.Error
          });
        }
      });
  };

  const { movies, total, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <Pagination key='pagination' total={total} page={initialState.page} />
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
          ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
