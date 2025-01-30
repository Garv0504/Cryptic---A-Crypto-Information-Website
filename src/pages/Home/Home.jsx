import React, { useContext, useEffect, useState, useRef } from 'react'
import "./Home.css"
import { CoinContext } from '../../context/CoinContext'
import { Link } from 'react-router-dom'

const Home = () => {

  const {allCoin, currency} = useContext(CoinContext)
  const [displayCoin, setDisplayCoin] = useState([])
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  
  // Reference for input and suggestion box
  const suggestionBoxRef = useRef(null)
  const inputRef = useRef(null)

  const inputHandler = (event) => {
    setInput(event.target.value)
    if(event.target.value === "") {
      setDisplayCoin(allCoin)
      setSuggestions([])
    } else {
      const filteredCoins = allCoin.filter((item) => 
        item.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
      setSuggestions(filteredCoins)
    }
  }

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => 
      item.name.toLowerCase().includes(input.toLowerCase())
    )
    setDisplayCoin(coins)
    setSuggestions([])
  }

  const handleSuggestionClick = (coinName) => {
    setInput(coinName)
    const coins = allCoin.filter((item) => item.name.toLowerCase() === coinName.toLowerCase())
    setDisplayCoin(coins)
    setSuggestions([])
    setActiveSuggestionIndex(-1) // Reset active suggestion index
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) => 
        Math.min(prevIndex + 1, suggestions.length - 1)
      )
    } else if (event.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    } else if (event.key === "Enter" && activeSuggestionIndex !== -1) {
      handleSuggestionClick(suggestions[activeSuggestionIndex].name)
    }
  }

  const handleClickOutside = (event) => {
    if (
      suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target) &&
      inputRef.current && !inputRef.current.contains(event.target)
    ) {
      setSuggestions([]) // Hide suggestions when clicking outside
    }
  }

  // Attach event listener to document to detect outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setDisplayCoin(allCoin)
  },[allCoin])

  return (
    <div className="home">
      <div className="hero">
        <h1>Largest <br/> Crypto Marketplace</h1>
        <p>Welcome to the world&apos;s largest cryptocurrency
          marketplace. Sign up to explore more about cryptos.
        </p>
        <form onSubmit={searchHandler} style={{ position: 'relative' }}>
          <input 
            ref={inputRef}
            onChange={inputHandler} 
            value={input} 
            type="text" 
            placeholder='Search Crypto...' 
            required 
            onKeyDown={handleKeyDown} // Detect key events for navigation
          />
          <button type="submit">Search</button>
          {suggestions.length > 0 && (
            <div ref={suggestionBoxRef} className="suggestions">
              {suggestions.map((coin, index) => (
                <div 
                  key={index} 
                  className={`suggestion-item ${activeSuggestionIndex === index ? 'active' : ''}`} 
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: activeSuggestionIndex === index ? 'rgba(113, 113, 113, 0.52)' : 'transparent',
                  }}
                  onClick={() => handleSuggestionClick(coin.name)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)} // Mouse hover effect
                >
                  {coin.name}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign: "center"}}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {
          displayCoin.slice(0,20).map((item,index) => (
            <Link to={`/coin/${item.id}`} key={index} className="table-layout">
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt={item.name} />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
              <p className={item.market_cap_change_percentage_24h > 0 ? "green" : "red"}>
                {item.market_cap_change_percentage_24h > 0 ? "+" : ""}
                {Math.floor(item.market_cap_change_percentage_24h*100)/100} %</p>
              <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Home
