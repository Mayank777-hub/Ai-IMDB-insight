import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar, faClapperboard, faThumbsUp, faThumbsDown,faRobot ,faTrophy} from "@fortawesome/free-solid-svg-icons";
import { faImdb } from "@fortawesome/free-brands-svg-icons";

export default async function MoviePage({ searchParams }) {
  const { title, id } = await searchParams;
  if (!title && !id) return <p>No Movie Found searched...</p>;

  let movie;

  if (id) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${process.env.MOVIEAPI_KEY}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    if (data.Response === "False") return <p>Movie not found.</p>;

    let trailer = null;
    let backdrop = null;
    let reviews = [];
    let cast = data.Actors?.split(", ").map(name => ({ name, character: null, photo: null })) || [];

    try {
      const tmdbFind = await fetch(
        `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id&api_key=${process.env.TMDB_KEY}`,
        { cache: "no-store" }
      );
      const tmdbData = await tmdbFind.json();
      const tmdbId = tmdbData.movie_results?.[0]?.id;

      if (tmdbId) {
        const [videoRes, creditsRes, reviewsRes, detailRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
          fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
          fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
          fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
        ]);

        const videoData = await videoRes.json();
        const creditsData = await creditsRes.json();
        const reviewsData = await reviewsRes.json();
        const detailData = await detailRes.json();

        const yt = videoData.results?.find(v => v.site === "YouTube" && v.type === "Trailer");
        trailer = yt ? `https://www.youtube.com/embed/${yt.key}` : null;
        backdrop = detailData.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${detailData.backdrop_path}` : null;

        cast = creditsData.cast?.slice(0, 8).map(c => ({
          name: c.name,
          character: c.character,
          photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
        })) || cast;

        reviews = reviewsData.results?.slice(0, 5).map(r => r.content) || [];
      }
    } catch (e) {}

    movie = {
      title: data.Title,
      year: data.Year,
      poster: data.Poster !== "N/A" ? data.Poster : null,
      backdrop,
      overview: data.Plot,
      genres: data.Genre,
      rating: data.imdbRating,
      runtime: data.Runtime,
      cast,
      language: data.Language,
      awards: data.Awards !== "NA" ? data.Awards : null,
      country: data.Country,
      writer: data.Writer,
      director: data.Director,
      boxOffice: data.BoxOffice !== "NA" ? data.BoxOffice : null,
      rated: data.Rated,
      votes: data.imdbVotes !== "NA" ? data.imdbVotes : null,
      ratings: data.Ratings?.map(a => `${a.Source}: ${a.Value}`).join(" | ") || null,
      trailer,
      reviews,
    };

  } else {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${process.env.TMDB_KEY}`,
      { cache: "no-store" }
    );
    const searchData = await searchRes.json();
    const movieId = searchData.results?.[0]?.id;
    if (!movieId) return <p>Movie not found.</p>;

    const [detailRes, creditsRes, videoRes, reviewsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.TMDB_KEY}`, { cache: "no-store" }),
    ]);

    const data = await detailRes.json();
    const credits = await creditsRes.json();
    const videos = await videoRes.json();
    const reviewsData = await reviewsRes.json();
    const yt = videos.results?.find(v => v.site === "YouTube" && v.type === "Trailer");

    movie = {
      title: data.title,
      year: data.release_date?.split("-")[0],
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
      overview: data.overview,
      genres: data.genres?.map(g => g.name).join(", "),
      rating: data.vote_average?.toFixed(1),
      votes: data.vote_count?.toLocaleString() || null,
      runtime: `${data.runtime} min`,
      director: credits.crew?.find(c => c.job === "Director")?.name || null,
      cast: credits.cast?.slice(0, 8).map(c => ({
        name: c.name,
        character: c.character,
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
      })) || [],
      trailer: yt ? `https://www.youtube.com/embed/${yt.key}` : null,
      reviews: reviewsData.results?.slice(0, 5).map(r => r.content) || [],
      awards: null, boxOffice: null, ratings: null, language: null, country: null,
    };
  }

  
  let sentiment = null;
  try {
    const reviewText = movie.reviews?.length > 0
      ? `Real audience reviews:\n${movie.reviews.map((r, i) => `Review ${i + 1}: ${r.slice(0, 300)}`).join("\n")}`
      : `No reviews available. Analyze based on movie data only.`;

    const prompt = `Analyze audience sentiment for this movie based on the data and real reviews below. Reply in pure JSON only, no markdown, no backticks.

Movie: ${movie.title} (${movie.year})
Genre: ${movie.genres}
Rating: ${movie.rating}/10
Plot: ${movie.overview}
${reviewText}

Return exactly this JSON with DYNAMIC scores based on actual sentiment:
{"verdict":"Positive","summary":"3 sentence summary based on real reviews","positive":["specific reason 1","specific reason 2","specific reason 3"],"negative":["specific criticism 1","specific criticism 2","specific criticism 3"],"positiveScore":70,"negativeScore":15,"mixedScore":15}

Rules: verdict = Positive OR Mixed OR Negative. Scores must total 100. Base scores on actual review tone not fixed values.`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      }),
      next: { revalidate: 86400 }
    });

    const Ai = await aiRes.json();
    const rawt = Ai.choices?.[0]?.message?.content || "";
    const jsonM = rawt.match(/\{[\s\S]*\}/);
    const parsed = jsonM ? JSON.parse(jsonM[0]) : null;
    sentiment = parsed?.verdict && parsed?.summary ? parsed : null;
  } catch (err) {
    console.log("Groq failing do something:", err);
  }

  const verdictColor = sentiment?.verdict === "Positive" ? "rgb(76, 175, 138)"
    : sentiment?.verdict === "Negative" ? "rgb(229, 107, 107)" : "rgb(240, 165, 0)";

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0f0f0f", color: "white" }}>

      {movie.backdrop && (
        <div style={{ position: "relative", width: "100%", height: "420px", overflow: "hidden" }}>
          <img src={movie.backdrop} alt={movie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2), #0f0f0f)"
          }} />
          <div style={{
            position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
            width: "900px", maxWidth: "95%"
          }}>
            <h1 style={{ fontSize: "40px", fontWeight: "900", margin: 0 }}>{movie.title}</h1>
            <p style={{ color: "white", marginTop: "6px" }}>
              {movie.year} {movie.runtime && `• ${movie.runtime}`} {movie.rated && `• ${movie.rated}`}
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        {!movie.backdrop && (
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>{movie.title}</h1>
        )}

        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          {movie.poster && (
            <img src={movie.poster} alt={movie.title}
              style={{ width: "180px", borderRadius: "12px", objectFit: "cover", flexShrink: 0, marginTop: movie.backdrop ? "-60px" : "0px", boxShadow: "0 15px 40px rgba(0,0,0,0.6)" }} />
          )}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ color: "gray", fontSize: "14px", marginBottom: "12px" }}>{movie.genres}</p>

            {movie.rating && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1a1a1a", padding: "8px 16px", borderRadius: "6px", marginBottom: "12px" }}>
                <FontAwesomeIcon icon={faRankingStar} style={{ color: "orange", width: "18px" }} />
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "orange" }}>{movie.rating}</span>
                <span style={{ color: "gray", fontSize: "13px" }}>/10</span>
                {movie.votes && <span style={{ color: "gray", fontSize: "12px" }}>({movie.votes} votes)</span>}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {movie.director && (
                <div style={{ padding: "10px", background: "black", borderRadius: "6px" }}>
                  <p style={{ fontSize: "10px", color: "rgb(85, 85, 85)", textTransform: "uppercase", letterSpacing: "1px" }}>Director</p>
                  <p style={{ color: "white", fontSize: "13px", fontWeight: "600", marginTop: "2px" }}>{movie.director}</p>
                </div>
              )}
              {movie.language && (
                <div style={{ padding: "10px", background: "black", borderRadius: "6px" }}>
                  <p style={{ fontSize: "10px", color: "rgb(85, 85, 85)", textTransform: "uppercase", letterSpacing: "1px" }}>Language</p>
                  <p style={{ color: "white", fontSize: "13px", marginTop: "2px" }}>{movie.language}</p>
                </div>
              )}
              {movie.boxOffice && (
                <div style={{ padding: "10px", background: "black", borderRadius: "6px" }}>
                  <p style={{ fontSize: "10px", color: "rgb(85, 85, 85)", textTransform: "uppercase", letterSpacing: "1px" }}>Box Office</p>
                  <p style={{ color: "white", fontSize: "13px", fontWeight: "bold", marginTop: "2px" }}>{movie.boxOffice}</p>
                </div>
              )}
              {movie.country && (
                <div style={{ padding: "10px", background: "black", borderRadius: "6px" }}>
                  <p style={{ fontSize: "10px", color: "rgb(85, 85, 85)", textTransform: "uppercase", letterSpacing: "1px" }}>Country</p>
                  <p style={{ color: "white", fontSize: "13px", marginTop: "2px" }}>{movie.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {movie.awards && (
          <div style={{ padding: "14px 16px", background: "black", borderRadius: "8px", marginBottom: "20px" }}>
           <p> <FontAwesomeIcon icon={faTrophy} style={{color: "rgb(255, 212, 59)",width:"24px",height:"24px"}} /></p>
            <p style={{ color: "white", fontSize: "13px", lineHeight: "1.6" }}>{movie.awards}</p>
          </div>
        )}

        {movie.ratings && (
          <div style={{ padding: "16px", background: "black", borderRadius: "8px", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", color: "gray", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}><FontAwesomeIcon icon={faImdb} style={{color: "rgb(255, 212, 59)",width:"24px",height:"24px"}} /></p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {movie.ratings.split(" | ").map((r, i) => {
                const [source, value] = r.split(": ");
                return (
                  <div key={i} style={{ textAlign: "center", padding: "10px 16px", background: "black", borderRadius: "6px" }}>
                    <p style={{ color: "yellow", fontSize: "18px", fontWeight: "bold" }}>{value}</p>
                    <p style={{ color: "gray", fontSize: "11px", marginTop: "4px" }}>{source}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ padding: "16px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#4caf8a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Plot</p>
          <p style={{ color: "#ccc", lineHeight: "1.8", fontSize: "14px" }}>{movie.overview}</p>
        </div>

        {movie.cast?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>Cast</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "16px" }}>
              {movie.cast.map((c, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  {c.photo
                    ? <img src={c.photo} alt={c.name} style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid #333" }} />
                    : <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                        <FontAwesomeIcon icon={faClapperboard} style={{ color: "#888" }} />
                      </div>
                  }
                  <p style={{ fontSize: "11px", fontWeight: "600", marginTop: "6px", color: "white" }}>{c.name}</p>
                  {c.character && <p style={{ fontSize: "10px", color: "red", marginTop: "2px" }}>{c.character}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {movie.reviews?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>
              Audience Reviews <span style={{ fontSize: "13px", color: "green", fontWeight: "normal" }}>from TMDB</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {movie.reviews.slice(0, 3).map((review, i) => (
                <div key={i} style={{ padding: "16px", background: "black", borderRadius: "8px" }}>
                  <p style={{ color: "white", fontSize: "13px", lineHeight: "1.7" }}>
                    {review.length > 400 ? review.slice(0, 400) + "..." : review}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sentiment ? (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}><FontAwesomeIcon icon={faRobot} style={{color:"red", width: "24px",height:"24px"}}/> AI Sentiment Analysis</h2>

            <div style={{ textAlign: "center", padding: "20px", border: `2px solid ${verdictColor}`, borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", color: "rgb(136, 136, 136)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Overall Verdict</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: verdictColor }}>{sentiment.verdict}</p>
            </div>

            <div style={{ padding: "16px", background: "black", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ color: "white", lineHeight: "1.8", fontSize: "14px" }}>{sentiment.summary}</p>
              <p style={{ fontSize: "11px", color: "orange", marginTop: "8px" }}>
                ✦ Generated by Groq AI {movie.reviews?.length > 0 ? "· Based on real audience reviews" : "· Based on movie metadata"}
              </p>
            </div>

            <div style={{ padding: "16px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "16px" }}>
              {[
                { label: "Positive", val: sentiment.positiveScore, color: "rgb(76, 175, 138)" },
                { label: "Critical", val: sentiment.negativeScore, color: "rgb(229, 107, 107)" },
                { label: "Mixed",    val: sentiment.mixedScore,    color: "rgb(240, 165, 0)" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px", color: "white" }}>
                    <span>{label}</span>
                    <span style={{ color, fontWeight: "bold" }}>{val}%</span>
                  </div>
                  <div style={{ height: "8px", background: "rgb(51, 51, 51)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${val}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ padding: "16px", background: "black", borderRadius: "8px", border: "2px solid green" }}>
                <h3 style={{ color: "green", marginBottom: "10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FontAwesomeIcon icon={faThumbsUp} style={{ width: "13px" }} /> What audiences love
                </h3>
                <ul style={{ paddingLeft: "16px", color: "white", fontSize: "13px", lineHeight: "1.9" }}>
                  {sentiment.positive?.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div style={{ padding: "16px", background: "black", borderRadius: "8px", border: "2px solid red" }}>
                <h3 style={{ color: "red", marginBottom: "10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FontAwesomeIcon icon={faThumbsDown} style={{ width: "13px" }} /> Common criticisms
                </h3>
                <ul style={{ paddingLeft: "16px", color: "white", fontSize: "13px", lineHeight: "1.9" }}>
                  {sentiment.negative?.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "24px", background: "black", borderRadius: "8px", textAlign: "center", marginBottom: "32px" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}><FontAwesomeIcon icon={faRobot} style={{color: "yellow",}} /></p>
            <p style={{ color: "gray", fontSize: "14px" }}>AI Moviefans analysis unavailable</p>
            <p style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}>Quota exceeded or API error</p>
          </div>
        )}

        {movie.trailer && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}><FontAwesomeIcon icon={faClapperboard} style={{color:"yellow",width:"24px",height:"24px"}}/> Trailer</h2>
            <iframe width="100%" height="420" src={movie.trailer} title="Trailer"
              allowFullScreen style={{ borderRadius: "10px", boxShadow: "0 10px 40px rgba(246, 0, 0, 0.73)" }} />
          </div>
        )}

      </div>
    </div>
  );
}