import React, { useRef } from 'react';

export default function Pagination({ totPages, setCurrentPage }) {
    const activePage = useRef(null);


    const handlePageChange = (event) => (pageNum) => {
        const firstBtn = document.getElementById('page-0');
        firstBtn.classList.remove('active');

        if (activePage.current) {
            activePage.current.classList.remove('active');
        }
        event.target.classList.add('active');
        activePage.current = event.target;
        const startingBookIndex = 20 * pageNum; // index of the book we start displaying from.
        setCurrentPage(s => ({ limit: startingBookIndex + 20, offset: startingBookIndex }))
    };


    const pages = Array.from({ length: Math.floor(totPages / 20) }).map((_, num) => <button ref={activePage} key={'pagination-' + num} onClick={(event) => handlePageChange(event)(num)} id={'page-' + num} className={num === 0 ? 'active pagination-btn flex items-center justify-center' : 'pagination-btn flex items-center justify-center'}>{(20 * num) + 1 + "-" + ((20 * num) + 20)}</button>)
    return (<>
        <h4 className='pagination-label'>Pages:</h4>
        <div className='flex pagination flex-wrap justify-between' style={{ width: 700 }}>

            {pages}
        </div>
    </>
    )
}
