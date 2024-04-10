var loadedBooks = []
var limit = 10

function loadBooks(data) {
    let url = "https://openlibrary.org/search.json?"

    if(data.query) {
        url += `q=${data.query}`
    } else {
        url += `q=Classics`
    }

    if(limit) url += `&limit=${limit}`

    url += "&fields=key,title,author_name,editions,editions.key,editions.title,ratings_average"

    showLoading()

    axios.get(url)
        .then(resp => {
            if(resp && resp.data && resp.data.docs) {
                loadedBooks = resp.data.docs
                renderBooks(resp.data.docs)
            }
        })
        .catch(err => {
            showError()
            loadedBooks = []
            console.log(err)
        })
}

function sortBooks(value) {
    if(value) {
        let sortedBooks

        if(value == 'title') {
            sortedBooks = loadedBooks.sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });
        }

        if(value == 'author') {
            sortedBooks = loadedBooks.sort((a, b) => {
                const authorA = a.author_name ? a.author_name.join(', ').toLowerCase() : ''
                const authorB = b.author_name ? b.author_name.join(', ').toLowerCase() : ''
                if (authorA < authorB) return -1;
                if (authorA > authorB) return 1;
                return 0;
            });
        }

        if(value == 'rating') {
            sortedBooks = loadedBooks.sort((a, b) => {
                return b.ratings_average - a.ratings_average;
            });
        }

        renderBooks(sortedBooks)
    }
}

function showLoading() {
    let tableBody = document.getElementById('table-body')
    //clear exisiting books
    tableBody.innerHTML = ''

    let loadingText = document.createElement('td')
    loadingText.colSpan = 3
    loadingText.innerText = 'Loading books...'

    tableBody.appendChild(document.createElement('tr').appendChild(loadingText))
}

function showError() {
    let tableBody = document.getElementById('table-body')
    //clear exisiting books
    tableBody.innerHTML = ''

    let loadingText = document.createElement('td')
    loadingText.colSpan = 3
    loadingText.innerText = 'An error occured while loading books...'

    tableBody.appendChild(document.createElement('tr').appendChild(loadingText))
}

function renderEmpty() {
    let tableBody = document.getElementById('table-body')
    //clear exisiting books
    tableBody.innerHTML = ''

    let loadingText = document.createElement('td')
    loadingText.colSpan = 3
    loadingText.innerText = 'No books found matching your selection...'

    tableBody.appendChild(document.createElement('tr').appendChild(loadingText))
}

function renderBooks(books) {
    let tableBody = document.getElementById('table-body')
    //clear exisiting books
    tableBody.innerHTML = ''

    if(!books || books.length == 0) {
        renderEmpty()
    }

    books.map(book => {
        let row = document.createElement('tr')

        //title
        let title = document.createElement('td')
        title.textContent = book.title
        row.appendChild(title)

        //author
        let author = document.createElement('td')
        author.textContent = book.author_name ? book.author_name.join(', ') : ''
        row.appendChild(author)

        //rating
        let rating = document.createElement('td')
        rating.textContent = book.ratings_average
        row.appendChild(rating)

        tableBody.appendChild(row)
    })
}

document.addEventListener("DOMContentLoaded", function(event) {
    //load initial books with initial query
    loadBooks({query: "Science fiction"})

    //search event listener
    var searchInput = document.getElementById("search-input");

    searchInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            
            loadBooks({query: searchInput.value})
        }
    });

    //change event on sort
    var sortInput = document.getElementById("sort");

    sortInput.addEventListener("change", function(event) {
        sortBooks(sortInput.value)
    });

    //limit
    var limitInput = document.getElementById("limit");

    limitInput.addEventListener("change", function(event) {
        limit = limitInput.value

        loadBooks({query: searchInput.value})
    });

});