import logo from './logo.svg';
import './App.css';
import Layout from './layouts/Layout';
import logoImage from './assets/images/logo.png';
import searchIcon from './assets/images/search_icon.png';
import selectIcon from './assets/images/select_icon.png';
import { useEffect, useState } from 'react';

function App() {

  const [movieList, setMovieList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [keywords, setKeywords] = useState('');
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});

  useEffect(() => {
    getMovieList();
  }, []);

  const getMovieList = async (page = 1, isClear = false) => {
    const api_key = process.env.REACT_APP_API_KEY;
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + api_key + '&language=en-US&sort_by=' + sortBy + '&include_adult=false&include_video=false&page=' + page + '&with_watch_monetization_types=flatrate&with_keywords=' + keywords)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results;
        if (isClear) {
          setMovieList(movies);
        } else {
          setMovieList([...movieList, ...movies]);
        }
        setCurrentPage(data.page);
      })
      .catch((err) => {
         console.log(err.message);
      });
  };

  const searchMovieList = async (page = 1, isClear = false) => {
    const api_key = process.env.REACT_APP_API_KEY;
    fetch('https://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&language=en-US&page=' + page + '&include_adult=false&query=' + keywords)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results;
        if (isClear) {
          setMovieList(movies);
        } else {
          setMovieList([...movieList, ...movies]);
        }
        setCurrentPage(data.page);
      })
      .catch((err) => {
         console.log(err.message);
      });
  };

  const getVideoList = async (id) => {
    const api_key = process.env.REACT_APP_API_KEY;
    fetch('https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + api_key + '&language=en-US')
      .then((response) => response.json())
      .then((data) => {
        const videos = data.results;
        setVideoList(videos);
      })
      .catch((err) => {
         console.log(err.message);
      });
  };

  const sortMovieList = (sort_by) => {
    setMovieList([]);
    setSortBy(sort_by);
    getMovieList(1, true);
  };

  const showDetail = (id) => {
    setDetailInfo(movieList.filter(movieItem => movieItem.id == id)[0]);
    getVideoList(id);
    setIsShowDetail(true);
  };

  const searchMovie = () => {
    setMovieList([]);
    searchMovieList(1, true);
  };

  return (
    <Layout>
      <div className="flex px-9 py-8 bg-gradient-to-r from-black to-gray-900 shadow w-full h-[96px]">
        <div className="w-1/6 h-full">
          <img src={logoImage} />
        </div>
        <div className="flex w-full justify-center">
          <div className="relative w-96 h-10">
            <input type={"text"} className="flex space-x-24 items-center justify-end flex-1 h-full w-full px-5 pt-1.5 pb-2 bg-gray-800 rounded-2xl text-white" placeholder="Search Movies & People" onChange={ (event) => setKeywords(event.target.value) } />
            <img className="absolute top-2 right-4 w-6 h-5 rounded-lg" src={searchIcon} onClick={ () => searchMovie() } />
          </div>
        </div>
      </div>
      <div className="bg-[#1717177F] px-2 py-4">
        <div className="flex flex-col items-start justify-end px-4 py-4 bg-gray-900 bg-opacity-50 shadow rounded-3xl">
          <div className="w-full h-full flex justify-end">
            <div className="relative">
              <select className="filter-select flex space-x-1.5 items-center justify-end h-full pl-7 pr-12 py-2.5 bg-gray-600 rounded-full text-base font-semibold text-white" onChange={ (event) => sortMovieList(event.target.value) }>
                <option value="popularity.desc">Popularity Descending</option>
                <option value="popularity.asc">Popularity Ascending</option>
                <option value="vote_average.desc">Rating Descending</option>
                <option value="vote_average.asc">Rating Ascending</option>
                <option value="release_date.desc">Release Date Descending</option>
                <option value="release_date.asc">Release Date Ascending</option>
                <option value="original_title.asc">Title (A-Z)</option>
                <option value="original_title.desc">Title (Z-A)</option>
              </select>
              <img className="absolute top-4 right-6" src={selectIcon} />
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-5 pt-5">
            {
              movieList.map((movieItem) => (
                <div key={"movie-item-" + movieItem.id} className="flex flex-col gap-2 space-y-0.5 w-full h-[400px] cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300" onClick={() => showDetail(movieItem.id)}>
                  <img className="w-full h-5/6 shadow-black shadow-lg rounded-md" src={ "https://www.themoviedb.org/t/p/w220_and_h330_face" + movieItem.poster_path }/>
                  <p className="w-full h-6 text-base font-bold text-white truncate">{ movieItem.title }</p>
                  <div className="flex flex-row justify-between">
                    <p className="w-24 h-3.5 text-xs font-bold text-gray-400">{ movieItem.release_date }</p>
                    <div className="flex flex-row justify-end">
                      <p className="w-7 h-full text-xs font-bold text-yellow-400">{ movieItem.vote_average.toFixed(2) }</p>
                      <p className="text-xs font-bold text-white">/ 10</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="flex justify-center w-full pt-5">
            <p className="text-base font-bold text-center text-white cursor-pointer hover:underline animate-bounce" onClick={() => getMovieList(currentPage + 1)}>See more...</p>
          </div>
        </div>
      </div>
      {/* Detail Panel */}
      <div className="fixed top-0 left-0 w-full h-full justify-center items-center bg-[#bdbdbd85]" id="detail_panel" style={{ display: isShowDetail ? "flex" : "none" }}>
        <div className="flex flex-col gap-2 w-4/5 h-4/5 bg-[#0e1420] shadow-lg shadow-slate-700 rounded-xl p-5">
          <div className="flex justify-end w-full">
            <button className="text-white underline" onClick={() => setIsShowDetail(false)}>Close</button>
          </div>
          <div className="flex justify-start">
            <p className="text-white font-bold text-2xl">{ detailInfo.title }</p>
          </div>
          <div className="w-full">
            <iframe className="w-full h-[500px]" src={'https://www.youtube.com/embed/' + (videoList.length > 0 ? videoList[0].key : '')}>
            </iframe>
          </div>
          <div className="w-full">
            <p className="text-white text-lg">{ detailInfo.overview }</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
