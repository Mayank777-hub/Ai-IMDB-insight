'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation";
import "./homepage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faXTwitter, 
  faFacebook, 
  faReddit 
} from "@fortawesome/free-brands-svg-icons";
import { faStar, faCircleArrowLeft, faCircleArrowRight, faBookOpenReader, faEnvelope } from "@fortawesome/free-solid-svg-icons";
const old = {
  menu: "Menu",
  placeholder: "Search your movie here...",
  signin: "Sign In",
  welcome: "Welcome to Movie Search",
  errorEmpty: "Searchbar cannot be empty",
  wishlist: "WishList",
  topShows: "Top TV/Shows",
  browseCategories: "Browse By Categories",
  top10Heading: "Top 10 IMDB rated Movies, Webseries & Shows",
  needHelp: "Need Help ?",
  connectUs: "Connect Us",
  companyPolicies: "Company Policies",
  feedback: "Feedback",
  visitHelp: "Visit Help Centre",
  contactUs: "Contact us",
  phone: "1834-256-1667",
  giveSuggestion: "Give Suggestion",
  userPolicy: "User Policy",
  sellerPolicy: "Seller Policy",
  privacyPolicy: "Privacy Policy",
  copyright: "Mangaverse©. All Rights Reserved",
  termsLine: "Terms & Condition | FAQ | Advertisement",
  cat0: "Horror",
  cat1: "Adventure",
  cat2: "Animated",
  cat3: "Romance",
  cat4: "Mystery",
  cat5: "Psychological",
  cat6: "Supernatural",
  cat7: "Dark",
  cat8: "Thriller",
  cat9: "Erotic",
  trend0: "A Knight of the Seven Kingdoms",
  trend1: "Breaking Bad",
  trend2: "Scream7",
  trend3: "Bridgerton",
  trend4: "Paradise",
  trend5: "The Night Agent",
  trend6: "The Bluff",
  trend7: "The Pitt",
  trend8: "Wuthering Heights",
  trend9: "Game of Thrones",
};

const trending = [
  { rank: 1, id: "tt0944947", img: "https://resizing.flixster.com/QQQKrYEmeecYVjlUyjemL8eQ3eA=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vNjE5MmI2Y2QtZjIzNy00NzE3LWI3NWMtODRmODYxMTY1OWMyLmpwZw==" },
  { rank: 2, id: "tt0903747", img: "https://m.media-amazon.com/images/I/71Jlk8BkjeL.jpg" },
  { rank: 3, id: "tt0117571", img: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Scream_7_%28poster%29.jpg/250px-Scream_7_%28poster%29.jpg" },
  { rank: 4, id: "tt8740790", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrN3WH5WW0cPVAJUULpfWED77NY75iF23PdA&s" },
  { rank: 5, id: "tt15438246", img: "https://m.media-amazon.com/images/M/MV5BYTNmMjEwZGYtZWJjNy00MjI2LWI3YmUtNTY3NjVkMmU4MDM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { rank: 6, id: "tt13918776", img: "https://m.media-amazon.com/images/M/MV5BMDU5ZjhhNWMtMjM2MC00OWNmLTlmYTMtOTQ5OTBlZjc2NTdhXkEyXkFqcGc@._V1_.jpg" },
  { rank: 7, id: "tt1517268", img: "https://m.media-amazon.com/images/M/MV5BZDVlYWM2YjAtZTUxMS00OWEwLWI4YWMtNmFhMjU3MDY4OGJkXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg" },
  { rank: 8, id: "tt13819960", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmZqMR8tobyg8B-FghchFHvs-ZNoj8BkRMpQ&s" },
  { rank: 9, id: "tt0048424", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRVyim1sOEJlsyqi8XtGIBKpW5He5iOzTKPg&s" },
  { rank: 10, id: "tt0944947", img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Game_of_thrones_telltale_games_season_one.jpg" }
];

const cat = [
  { img: "https://m.media-amazon.com/images/I/81dZ7NNKDCL.jpg" },
  { img: "https://wp.scoopwhoop.com/wp-content/uploads/2024/04/04162434/image-6.png" },
  { img: "https://image.tmdb.org/t/p/original/WGRQ8FpjkDTzivQJ43t94bOuY0.jpg" },
  { img: "https://cdn.siasat.com/wp-content/uploads/2025/07/image-11-70.jpg" },
  { img: "https://images.squarespace-cdn.com/content/v1/5e8d4fb7e588a40015eabc64/1617296703631-NHF6I8OH6HR9J2VUPBZD/image-asset.png" },
  { img: "https://www.psychdegrees.org/wp-content/uploads/2017/12/bf6dfd8961559.560c647779a9c.jpg" },
  { img: "https://m.media-amazon.com/images/M/MV5BMDFmMGZmMGItNGRjNC00NjVjLWI5ODEtNzhjMTE5MmJhN2FkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxrGkZU24WIWqanPeuPcmrnl0TDKJe60mvIA&s" },
  { img: "https://upload.wikimedia.org/wikipedia/en/5/5a/It_%282017%29_poster.jpg" },
  { img: "https://m.media-amazon.com/images/M/MV5BNDI2MzBhNzgtOWYyOS00NDM2LWE0OGYtOGQ0M2FjMTI2NTllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
];

const movies = [
  {
    id: "tt12637874",
    title: "Fallout",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS08z1UclJ5V6z3J_NL1tWpdCLdZ6amcUkt2g&s",
    imdb: "8.4",
    rotten: "93%",
    genre: "Action, Adventure, Sci-Fi",
    awards: "Nominated for multiple Primetime Emmy Awards",
    description: "In a post-apocalyptic world, survivors navigate a brutal wasteland shaped by nuclear war and political conflict.",
  },
  {
    id: "tt31193180",
    title: "Sinners",
    img: "https://m.media-amazon.com/images/M/MV5BNjIwZWY4ZDEtMmIxZS00NDA4LTg4ZGMtMzUwZTYyNzgxMzk5XkEyXkFqcGc@._V1_.jpg",
    imdb: "7.8",
    rotten: "89%",
    genre: "Drama, Thriller",
    awards: "Official Selection at International Film Festivals",
    description: "A gripping tale of redemption and betrayal where dark secrets resurface and challenge moral boundaries.",
  },
  {
    id: "tt30003786",
    title: "The Great Kapil Sharma Show",
    img: "https://img.rgstatic.com/content/show/64acf0ce-85f0-4f30-9690-75ea51484e20/poster-342.jpg",
    imdb: "7.2",
    rotten: "75%",
    genre: "Comedy, Talk Show",
    awards: "Winner of Indian Television Academy Awards",
    description: "A celebrity talk show filled with comedy sketches, interviews, and hilarious interactions with Bollywood stars.",
  },
  {
    id: "tt13930822",
    title: "Tomb Raider",
    img: "https://m.media-amazon.com/images/M/MV5BMWZmYmUyMWEtNjM4MC00MTIyLWI0MzMtYTJhMTU5NTBjZWUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    imdb: "6.3",
    rotten: "52%",
    genre: "Action, Adventure",
    awards: "Nominated for Teen Choice Awards",
    description: "Lara Croft embarks on a dangerous journey to uncover the mysteries behind her father's disappearance.",
  },
  {
    id: "tt0903747",
    title: "Breaking Bad",
    img: "https://m.media-amazon.com/images/I/71Jlk8BkjeL._AC_UF1000,1000_QL80_.jpg",
    imdb: "9.5",
    rotten: "96%",
    genre: "Crime, Drama, Thriller",
    awards: "Won 16 Primetime Emmy Awards",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student in a descent into crime.",
  },
];

export default function Page() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState(old);
  const [active, setActive] = useState(0);
  const route = useRouter();
  const scrollRef = useRef(null);
  const showref = useRef(null);

  const [shows, setShows] = useState([]);

  useEffect(() => {
    async function getShows() {  // yeh par dynamic tv/toprated for shows fetch dynamic data
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
        );
        const data = await res.json();
        setShows(data.results.slice?.(10, 20));
      } catch (err) {
        console.log("Fetch error:", err);
      }
    }
    getShows();
  }, []);

  useEffect(() => {
    const animatime = 25000; //25 as i put 25 s for slider
    const slideD = animatime / 5;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % movies.length);
    }, slideD);
    return () => clearInterval(interval);
  }, []);

  const HandleClickLeft = () => { if (scrollRef.current) scrollRef.current.scrollLeft -= 300; };   // ise left jayega
  const HandleClickRight = () => { if (scrollRef.current) scrollRef.current.scrollLeft += 300; };  // ise right
  const HandleClickLeftone = () => { if (showref.current) showref.current.scrollLeft -= 300; };    // ise left jayega
  const HandleClickRightone = () => { if (showref.current) showref.current.scrollLeft += 300; };   // ise right

  const searchbar = () => {
    if (!search.trim()) {
      setError(content.errorEmpty);
      return;
    }
    setError("");
    const isImdbId = search.trim().startsWith("tt");
    route.push(`/movie?${isImdbId ? `id=${search.trim()}` : `title=${search.trim()}`}`);
  };

  async function translate(tran) {
  if (!tran) return;
  if (tran === "en") { setContent(old); return; }

  const keys = Object.keys(old);
  try {
    const results = await Promise.all(keys.map(async (key) => {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(old[key])}&langpair=en|${tran}`);
      const data = await res.json();
      return data.responseData.translatedText;
    }));

    const store = {};
    keys.forEach((key, idx) => store[key] = results[idx]);
    setContent(store);
  } catch (err) {
    console.log("Translation error:", err);
    setContent(old);
  }
}
  return (
    <>
      <div className="homecont">
        <div className="navbar">
          <div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDB" style={{ width: "80px", height: "40px" }} />
          </div>
          <div className="menu">{content.menu}</div>
          <div>
            <input
              className="searchbar"
              type="text"
              placeholder={content.placeholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') searchbar(); }}
              style={{ border: "1px solid yellow" }}
            />
            {error && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
          </div>
          <div className="wish">
            <FontAwesomeIcon icon={faBookOpenReader} style={{ color: "yellow" }} />
            <h6 style={{ color: "white" }}>{content.wishlist}</h6>
          </div>
          <div className="signin">{content.signin}</div>
          <div className="language">
            <select onChange={(e) => translate(e.target.value)}>
              <option value="">Select Language</option>
              <option value="es">Spanish</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
        <div className="all">
          <div className="contain">   
            <div className="slide slide1"><img src="https://deadline.com/wp-content/uploads/2024/04/image001.jpg" alt="Slider1" /></div>
            <div className="slide slide2"><img src="https://flixchatter.net/wp-content/uploads/2025/04/sinners-movie-poster.jpg" alt="Slider2" /></div>
            <div className="slide slide3"><img src="https://images.filmibeat.com/img/popcorn/movie_lists/kapil-sharma-returns-the-great-indian-kapil-show-season-4--ott-release-date--full-details-20251210165256-4032.jpg" alt="Slider3" /></div>
            <div className="slide slide4"><img src="https://raidingtheglobe.com/images/news/tv/tomb_raider_the_legend_of_lara_croft_behind_the_scenes.jpg" alt="Slider4" /></div>
            <div className="slide slide5"><img src="https://media.licdn.com/dms/image/v2/D4E12AQEhztjiTeKE5g/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1724706885851?e=2147483647&v=beta&t=mF-jCtZnTGXftM-i9NyxHALFWPew6WlFRDSfztd3Kg8" alt="Slider5" /></div>
          </div>

          <div className="storedet">
            <div
              className="infoBox"
              style={{ border: "1px solid white" }}
              onClick={() => route.push(`/movie?id=${movies[active].id}`)}
            >
              <img src={movies[active].img} alt={movies[active].title} />
            </div>
            <div className="detail" onClick={() => route.push(`/movie?id=${movies[active].id}`)}>
              <h1>{movies[active].title}</h1>
              <p>{movies[active].description}</p>
              <div className="ratings">
                <span>
                  <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} /> IMDb: {movies[active].imdb}
                </span>
                <span> RT: {movies[active].rotten}</span>
              </div>
              <p><strong>Genre:</strong> {movies[active].genre}</p>
              <p><strong>Awards:</strong> {movies[active].awards}</p>
            </div>
          </div>
        </div>
        <div className="moviecat">
          <h3 className="bush3">{content.topShows}</h3>
          <div className="catbox" ref={showref}>
            {shows.map((show) => (      // dyanmic ha
              <div
                className="boxone"
                key={show.id}  // we use shows data here above obe from usesatae
                onClick={() => route.push(`/movie?title=${show.name}`)}
              >
                <div className="blacklayer"></div>
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="gif"
                />
                <div className="above">{show.name}</div>
              </div>
            ))}
          </div>
          <div className='scrollandr'>
            <button className='btn1' onClick={HandleClickLeftone}>
              <FontAwesomeIcon icon={faCircleArrowLeft} size="2x" style={{ color: "yellow" }} />
            </button>
            <button className='btn2' onClick={HandleClickRightone}>
              <FontAwesomeIcon icon={faCircleArrowRight} size="2x" style={{ color: "yellow" }} />
            </button>
          </div>
        </div>                                                                                               {/*yeh wale static*/}
        <div className="moviecat">
          <h3 className="bush3">{content.browseCategories}</h3>
          <div className="catbox" ref={scrollRef}>
            {cat.map((item, index) => (
              <div className="boxone" key={index}>
                <div className="blacklayer"></div>
                <img src={item.img} alt={content[`cat${index}`]} className="gif" />
                <div className="above">{content[`cat${index}`]}</div>  
              </div>
            ))}
          </div>
          <div className='scrollandr'>
            <button className='btn1' onClick={HandleClickLeft}>
              <FontAwesomeIcon icon={faCircleArrowLeft} size="2x" style={{ color: "yellow" }} />
            </button>
            <button className='btn2' onClick={HandleClickRight}>
              <FontAwesomeIcon icon={faCircleArrowRight} size="2x" style={{ color: "yellow" }} />
            </button>
          </div>
        </div>     
        <div className="top10">
          <div className="h1" style={{ color: "yellow", fontSize: "40px" }}>
            {content.top10Heading}
          </div>
          <div className="topr">
            {trending.slice(0, 3).map((m) => (
              <div key={m.rank} className="bigcard" onClick={() => route.push(`/movie?id=${m.id}`)}>
                <span className="rank">#{m.rank}</span>
                <img src={m.img} alt={content[`trend${m.rank - 1}`]} />
                <p style={{ color: "yellow" }}>{content[`trend${m.rank - 1}`]}</p>  
              </div>
            ))}
          </div>
          <div className="bottomr">
            {trending.slice(3).map((m) => (  // left over after theen yja se
              <div key={m.rank} className="smallcard" onClick={() => route.push(`/movie?id=${m.id}`)}>
                <span className="rank">#{m.rank}</span>
                <img src={m.img} alt={content[`trend${m.rank - 1}`]} />
                <p style={{ color: "yellow" }}>{content[`trend${m.rank - 1}`]}</p>  
              </div>
            ))}
          </div>
        </div>
        <div className='hollow'>
          <div className='navtwo'>
            <span><a href="/" className='a'>{content.needHelp}</a></span>
            <span><a href="/" className='a'>{content.connectUs}</a></span>
            <span><a href="/" className='a'>{content.companyPolicies}</a></span>
            <span><a href="/" className='a'>{content.feedback}</a></span>
          </div>
          <div className='proper'>
            <div className='boxlast'>
              <div>{content.visitHelp}</div>
              <div>{content.contactUs}</div>
              <div>{content.phone}</div>
            </div>
            <div className='icons'>
              <div className='conn'>
                <a href="/" className='loc'><FontAwesomeIcon icon={faEnvelope} /></a>
                <a href="/" className='loc'><FontAwesomeIcon icon={faXTwitter} /></a>
                <a href="/" className='loc'><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="/" className='loc'><FontAwesomeIcon icon={faReddit} /></a>
              </div>
              <div className='connex'>
                <div><a className="cox" href="/">BrewIMDB@gmail.com</a></div>
                <div><a className="cox" href="/">BREW_verse</a></div>
                <div><a className="cox" href="/">BrewVerse404</a></div>
                <div><a className="cox" href="/">r/Brewaverse</a></div>
              </div>
            </div>
            <div className='chan'>
              <div>{content.userPolicy}</div>
              <div>{content.sellerPolicy}</div>
              <div>{content.privacyPolicy}</div>
            </div>
            <div className='last'>
              <div>{content.giveSuggestion}</div>
              <a href="https://play.google.com/store/apps/details?id=com.brewtv.watch" target="_blank">
                <img style={{ cursor: "pointer" }} src="https://createstir.b-cdn.net/stir-static/icon-google-play.png" alt="Google Play" width="150px" height="50px" />
              </a>
              <a href="https://apps.apple.com/us/app/brew-tv-watch-hidden-gems/id6756257835" target="_blank">
                <img style={{ cursor: "pointer" }} src="https://createstir.b-cdn.net/stir-static/icon-apple-store.svg" alt="App Store" width="150px" height="50px" />
              </a>
            </div>
          </div>
          <div className='akri'>
            <div>{content.copyright}</div>
            <div>{content.termsLine}</div>
          </div>
        </div>

      </div>
    </>
  );
}