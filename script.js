document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "inspirational" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "inspirational" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
        { text: "Get busy living or get busy dying.", author: "Stephen King", category: "life" },
        { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "life" },
        { text: "The unexamined life is not worth living.", author: "Socrates", category: "life" },
        { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson", category: "inspirational" },
        { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
        { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth", category: "inspirational" },
        { text: "Money and success don’t change people; they merely amplify what is already there.", author: "Will Smith", category: "life" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "inspirational" },
        { text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer", category: "inspirational" }
    ];

    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const newQuoteBtn = document.getElementById("new-quote");
    const copyQuoteBtn = document.getElementById("copy-quote");
    const favoriteQuoteBtn = document.getElementById("favorite-quote");
    const favoritesList = document.getElementById("favorites-list");
    const categorySelect = document.getElementById("category-select");

    let currentQuoteIndex = null;

    function getRandomQuote(category = "all") {
        let filteredQuotes = quotes;
        if (category !== "all") {
            filteredQuotes = quotes.filter(quote => quote.category === category);
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        currentQuoteIndex = quotes.indexOf(filteredQuotes[randomIndex]);
        return filteredQuotes[randomIndex];
    }

    function setNewQuote() {
        const { text, author } = getRandomQuote(categorySelect.value);
        quoteText.textContent = text;
        quoteAuthor.textContent = `— ${author}`;
        adjustFontSize(text);
    }

    function adjustFontSize(quote) {
        const length = quote.length;
        if (length < 50) {
            quoteText.parentElement.classList.add('short');
            quoteText.parentElement.classList.remove('medium', 'long');
        } else if (length < 100) {
            quoteText.parentElement.classList.add('medium');
            quoteText.parentElement.classList.remove('short', 'long');
        } else {
            quoteText.parentElement.classList.add('long');
            quoteText.parentElement.classList.remove('short', 'medium');
        }
    }

    function copyToClipboard() {
        const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
        navigator.clipboard.writeText(quote).then(() => {
            alert("Quote copied to clipboard!");
        });
    }

    function isQuoteDuplicate(quote) {
        // Normalize the quote text for comparison
        const normalizedQuote = quote.trim().toLowerCase();
        const existingQuotes = Array.from(favoritesList.querySelectorAll('li')).map(li => li.textContent.trim().toLowerCase());
        return existingQuotes.includes(normalizedQuote);
    }

   function addToFavorites() {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;

    // Check if the quote already exists in the favorites
    const existingFavorites = Array.from(favoritesList.querySelectorAll('li')).map(li => li.textContent.replace("Delete", "").trim());
    if (!existingFavorites.includes(quote)) {
        const li = document.createElement("li");
        li.textContent = quote;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function() {
            li.remove();
            saveFavoritesToLocalStorage();
        });

        li.appendChild(deleteBtn);
        favoritesList.appendChild(li);
        saveFavoritesToLocalStorage();
    } else {
        alert("This quote is already in your favorites!");
    }
}


    function saveFavoritesToLocalStorage() {
        const favorites = Array.from(favoritesList.querySelectorAll('li')).map(li => li.textContent.trim());
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    }

    function loadFavoritesFromLocalStorage() {
        const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
        favorites.forEach(quote => {
            const li = document.createElement("li");
            li.textContent = quote;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", function() {
                li.remove();
                saveFavoritesToLocalStorage();
            });

            li.appendChild(deleteBtn);
            favoritesList.appendChild(li);
        });
    }

    categorySelect.addEventListener("change", setNewQuote);
    newQuoteBtn.addEventListener("click", setNewQuote);
    copyQuoteBtn.addEventListener("click", copyToClipboard);
    favoriteQuoteBtn.addEventListener("click", addToFavorites);

    // Load favorites from localStorage and initialize with a random quote
    loadFavoritesFromLocalStorage();
    setNewQuote();
});
