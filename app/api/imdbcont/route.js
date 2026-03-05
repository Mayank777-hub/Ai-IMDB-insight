export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const movid = searchParams.get("id");

  if (!movid) {
    return Response.json({ message: "Movie ID NOT FOUND" }, { status: 400 });
  }

  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movid}?api_key=${process.env.TMDB_KEY}`
    );
    const res = await data.json();
    return Response.json(res, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Unable to fetch movie" }, { status: 500 });
  }
}