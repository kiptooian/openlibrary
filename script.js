function loadBooks(data) {
    let url = "https://openlibrary.org/search.json?"

    if(data.query) url += `q=${data.query}`

    url += "&limit=10&fields=key,title,author_name,editions,editions.key,editions.title,ratings_average"

    showLoading()

    axios.get(url)
        .then(resp => {
            if(resp && resp.data && resp.data.docs) {
                renderBooks(resp.data.docs)
            }
        })
        .catch(err => {
            showError()
            console.log(err)
        })
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
});