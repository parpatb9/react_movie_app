import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="search"/>
      <input 
        type="text" 
        placeholder="Search for a movie..." 
        className="bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
    </div>
  )
}

export default Search
