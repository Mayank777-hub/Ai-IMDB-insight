import React from 'react'

const Navbar = () => {
  return (
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
  )
}

export default Navbar
