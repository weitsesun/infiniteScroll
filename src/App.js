import React, { useState, useRef, useCallback } from 'react';
import uuid4 from 'uuid/v4';
import useBookSearch from './useBookSearch'

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)


  const {
    loading,
    error,
    books,
    hasMore } = useBookSearch(query, pageNumber);


  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1)
  }

  const observer = useRef()

  const lastBookElement = useCallback(node => {
    if(loading) return
    //will disconnect from previous element and connect to the new element correctly
    if(observer.current) observer.current.disconnect() 
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <>
      <input value={query} onChange={(e) => handleSearch(e)}></input>

      {books.map((title, index) => {
        if (index + 1 === books.length) {
          return (<div ref={lastBookElement} key={uuid4()}>{title}</div>)
        } else {
          return (<div key={uuid4()}>{title}</div>)
        }
      })}

      {loading && <div>Loading...</div>}
      {error && <div>Error!!</div>}
    </>
  );
}



export default App;
