import React from 'react'
import Search from './components/Search'

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassel
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        
      </div>
    </main>
  )
}

export default App
