import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { mergeSort } from "./helpers";
import Pagination from './Pagination';

function App() {
  const [allBooks, setAllBooks] = useState([]);


  useEffect(() => {
    let isMounted = true;
    fetch('https://raw.githubusercontent.com/topac/assignment/master/books.5000.json')
      .then(async response => {
        const fetchedBooks = await response.json();
        if (isMounted && fetchedBooks) {
          setAllBooks(fetchedBooks);
        }
      })
      .catch(e => console.error("error during fetch", e))

    return () => {
      isMounted = false;
      setAllBooks([]);
    };
  }, []);


  // Handle displayed books  
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState({ limit: 20, offset: 0 });
  useEffect(() => {
    // In the table the books currently displayed are between the offset and limit numbers.
    // The offset is the number of books from the first book in the array, while the limit is the offset book + 20 books.
    // The 20 books are those which are displayed in the table.
    setDisplayedBooks(allBooks.slice(currentPage.offset, currentPage.limit));
    return () => setDisplayedBooks([]);
  }, [allBooks, currentPage]);

  const bookRows = useMemo(() => {
    return displayedBooks.map((book) => {
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
  }, [displayedBooks]);


  const sortCol = useCallback((colName, order, type) => {
    const sortByColName = (allBooks) => {
      const sortedBooks = mergeSort(allBooks, colName, order, type);
      return sortedBooks;
    }
    setAllBooks(sortByColName);
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
      <Pagination setCurrentPage={setCurrentPage} totPages={allBooks?.length} />
    </div>
  );
}

export default App;
