import logo from './logo.svg';
import './App.css';
import Layout from './layouts/Layout';
import selectIcon from './assets/images/select_icon.png';
import movieIcon from './assets/images/sample_images/1.jpg';
import { useEffect, useState } from 'react';

function App() {

  const [movieList, setMovieList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});

  useEffect(() => {
    getMovieList();
  }, []);

  const getMovieList = async (page = 1, isClear = false) => {
    const api_key = process.env.REACT_APP_API_KEY;
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + api_key + '&language=en-US&sort_by=' + sortBy + '&include_adult=false&include_video=false&page=' + page + '&with_watch_monetization_types=flatrate')
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
    console.log(sort_by);
    setMovieList([]);
    setSortBy(sort_by);
    getMovieList(1, true);
  };

  const showDetail = (id) => {
    setDetailInfo(movieList.filter(movieItem => movieItem.id == id)[0]);
    getVideoList(id);
    setIsShowDetail(true);
  };

  return (
    <Layout>
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
          <div className="w-full grid grid-cols-5 gap-5 pt-5">
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
