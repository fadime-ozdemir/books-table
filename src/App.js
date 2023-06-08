import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { mergeSort } from "./helpers";

function App() {
  const [books, setBooks] = useState([]);
  const bookRows = useMemo(() => {
    return books.map((book) => {
      return <tr key={book.Isbn}>
        <td>
          {book.Isbn}
        </td>
        <td>
          {book.Title}
        </td>
        <td>
          {book.Author}
        </td>
        <td>
          {book.Year}
        </td>
        <td>
          {book.Publisher}
        </td>
      </tr>
    })
  }, [books]);

  const sortCol = useCallback((colName, order, type) => {
    const sortByColName = (books) => {
      const sortedBooks = mergeSort(books, colName, order, type);
      return sortedBooks;
    }
    setBooks(sortByColName);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("https://raw.githubusercontent.com/topac/assignment/master/books.5000.json")
      .then(async response => {
        const fetchedBooks = await response.json();
        if (isMounted) {
          setBooks(fetchedBooks);
          window.localStorage.setItem('books', JSON.stringify(fetchedBooks));
        }
      })
      .catch(e => console.error("error during fetch", e))

    return () => {
      isMounted = false;
      setBooks([])
    };
  }, []);

  const activeButtonRef = useRef(null);

  const tabHeaders = useMemo(() => {
    return [{ title: "Isbn", type: "number" }, { title: "Title", type: "string" }, { title: "Author", type: "string" }, { title: "Year", type: "number" }, { title: "Publisher", type: "string" }].map(({ title, type }, i) => {
      const handleSort = (event, sortedList) => {
        if (activeButtonRef.current) {
          activeButtonRef.current.classList.remove('active');
        }
        event.target.classList.add('active');
        activeButtonRef.current = event.target;
        return sortedList
      };
      return <td key={title + i}>
        <div className='flex justify-between'>
          <span>{title}</span>
          <div>
            <span>Sort order: </span>
            <button onClick={e => handleSort(e, sortCol(title, "asc", type))}>{type === "number" ? "0-9" : "A-Z"}</button>
            <button onClick={e => handleSort(e, sortCol(title, "desc", type))}>{type === "number" ? "9-0" : "Z-A"}</button>
          </div>
        </div>
      </td>
    })
  }, [sortCol])

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            {tabHeaders}
          </tr>
        </thead>
        <tbody>
          {bookRows}
        </tbody>
      </table>
    </div>
  );
}

export default App;
