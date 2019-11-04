import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ books, setBooks ] = useState([])
  const [ hasMore, setHasMore ] = useState(false)
  
  let cancelFunction

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    getBooks()
    return () => cancelFunction()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ query,  pageNumber])

  async function getBooks() {
    setLoading(true)
    setError(false);
    try{
      const res = await axios({
                              method: 'GET',
                              url: 'http://openlibrary.org/search.json',
                              params: { q: query, page: pageNumber },
                              cancelToken: new axios.CancelToken((c) => { cancelFunction = c })
                            })
      const data = res.data
      setBooks( prev => [...new Set([...prev, ...data.docs.map(b => b.title)])])
      setHasMore( res.data.docs.length > 0)
      setLoading(false)
    } catch(err) {
      if(axios.isCancel(err)) {
        return
      }
      setLoading(false)
      setError(true)
    }
  }
  
  return { loading, error, books, hasMore }
}
