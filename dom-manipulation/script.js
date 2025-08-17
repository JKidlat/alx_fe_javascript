// Initial data for the quotes. This array will be updated from local storage.
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Life" },
  { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" },
  { text: "Believe you can and you're halfway there.", category: "Belief" },
];

// Mock server data to simulate fetching new quotes.
const serverQuotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "The mind is everything. What you think you become.", category: "Mindfulness" }
];

// Get references to the necessary DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteAuthorElement = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const exportBtn = document.getElementById('exportQuotes');
const importFile = document.getElementById('importFile');
const syncStatus = document.getElementById('syncStatus');
const syncBtn = document.getElementById('syncQuotesBtn');

/**
 * Saves the current quotes array to local storage.
 * This is called after adding a new quote or importing quotes.
 */
function saveQuotes() {
  try {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to save quotes to local storage.", e);
  }
}

/**
 * Loads quotes from local storage when the application starts.
 * If no quotes are found, it uses the default initial quotes.
 */
function loadQuotes() {
  try {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  } catch (e) {
    console.error("Failed to load quotes from local storage. Using default quotes.", e);
  }
}

/**
 * Uses session storage to remember and load the last viewed quote.
 */
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadLastViewedQuote() {
  try {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
      const quoteObj = JSON.parse(lastQuote);
      quoteTextElement.innerHTML = `"${quoteObj.text}"`;
      quoteAuthorElement.innerHTML = `- ${quoteObj.category}`;
    }
  } catch (e) {
    console.error("Failed to load last viewed quote from session storage.", e);
  }
}

/**
 * Extracts unique categories from the quotes array and populates the filter dropdown.
 */
function populateCategories() {
  // Get unique categories.
  const categories = new Set(quotes.map(quote => quote.category));

  // Clear existing options, except "All Categories".
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new options for each unique category.
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/**
 * Selects a random quote from a given array and displays it in the DOM.
 * @param {Array} quoteList - The array of quotes to choose from.
 */
function displayRandomQuote(quoteList) {
  if (quoteList.length > 0) {
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    const randomQuote = quoteList[randomIndex];
    quoteTextElement.innerHTML = `"${randomQuote.text}"`;
    quoteAuthorElement.innerHTML = `- ${randomQuote.category}`;
    saveLastViewedQuote(randomQuote); // Save to session storage
  } else {
    quoteTextElement.innerHTML = "No quotes available in this category.";
    quoteAuthorElement.innerHTML = "";
  }
}

/**
 * Filters quotes based on the selected category and updates the displayed quote.
 */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  // Save the selected filter to local storage for persistence.
  localStorage.setItem('lastCategoryFilter', selectedCategory);

  let quotesToDisplay = quotes;
  if (selectedCategory !== 'all') {
    quotesToDisplay = quotes.filter(quote => quote.category === selectedCategory);
  }

  // Display a random quote from the filtered list.
  displayRandomQuote(quotesToDisplay);
}

/**
 * Loads the last selected category from local storage and applies the filter.
 */
function loadLastFilter() {
  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
  filterQuotes();
}

/**
 * Handles adding a new quote from the form inputs.
 */
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    displayStatus('error', "Please enter both a quote and a category.");
    return;
  }

  const newQuote = {
    text: text,
    category: category
  };

  // Add the new quote and save to local storage.
  quotes.push(newQuote);
  saveQuotes();

  // Update categories and display a new random quote.
  populateCategories();
  filterQuotes();

  // Clear the input fields.
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  displayStatus('success', "Quote added successfully!");
}

/**
 * Exports the quotes array to a JSON file.
 */
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports quotes from a JSON file selected by the user.
 */
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        // Use a Set to avoid importing duplicate quotes
        const quoteSet = new Set(quotes.map(q => JSON.stringify(q)));
        let newQuotesAdded = 0;
        importedQuotes.forEach(q => {
          const quoteString = JSON.stringify(q);
          if (!quoteSet.has(quoteString)) {
            quotes.push(q);
            quoteSet.add(quoteString);
            newQuotesAdded++;
          }
        });

        if (newQuotesAdded > 0) {
          saveQuotes();
          populateCategories();
          filterQuotes(); // Refresh the display
          displayStatus('success', `${newQuotesAdded} quotes imported successfully!`);
        } else {
          displayStatus('info', 'No new quotes to import.');
        }
      } else {
        displayStatus('error', 'Imported JSON is not a valid array of quotes.');
      }
    } catch (e) {
      displayStatus('error', 'Failed to parse JSON file.');
      console.error("Error importing file:", e);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

/**
 * Simulates fetching new quotes from a server.
 * This is a mock API call for demonstration.
 */
function fetchQuotesFromServer() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(serverQuotes);
    }, 1500); // Simulate network delay
  });
}

/**
 * Syncs local quotes with the simulated server data.
 * It checks for new quotes from the server and adds them to the local array.
 */
async function syncQuotes() {
  displayStatus('info', 'Syncing data with server...');
  
  try {
    const serverData = await fetchQuotesFromServer();
    let newQuotesFound = 0;
    
    // Create a Set for efficient lookup of existing quotes
    const localQuoteSet = new Set(quotes.map(q => JSON.stringify(q)));

    // Iterate through server data and add new, unique quotes to local storage
    serverData.forEach(serverQuote => {
      const quoteString = JSON.stringify(serverQuote);
      if (!localQuoteSet.has(quoteString)) {
        quotes.push(serverQuote);
        newQuotesFound++;
      }
    });

    if (newQuotesFound > 0) {
      saveQuotes(); // Save the merged data
      populateCategories(); // Update the categories dropdown
      filterQuotes(); // Refresh the displayed quote
      displayStatus('success', `Sync complete! ${newQuotesFound} new quotes added.`);
    } else {
      displayStatus('info', 'Sync complete. No new quotes found.');
    }
  } catch (e) {
    displayStatus('error', 'Sync failed. Please check your connection.');
    console.error("Sync error:", e);
  }
}

/**
 * Displays a status message to the user.
 */
function displayStatus(type, message) {
  syncStatus.textContent = message;
  syncStatus.classList.remove('hidden', 'bg-blue-100', 'bg-green-100', 'bg-red-100', 'text-blue-800', 'text-green-800', 'text-red-800');
  
  // Set the background and text color based on the message type
  if (type === 'success') {
    syncStatus.classList.add('bg-green-100', 'text-green-800');
  } else if (type === 'error') {
    syncStatus.classList.add('bg-red-100', 'text-red-800');
  } else { // info
    syncStatus.classList.add('bg-blue-100', 'text-blue-800');
  }
}

// Event listeners
newQuoteBtn.addEventListener('click', filterQuotes);
categoryFilter.addEventListener('change', filterQuotes);
addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', exportToJson);
importFile.addEventListener('change', importFromJsonFile);
syncBtn.addEventListener('click', syncQuotes);

// Initial setup on page load
window.onload = () => {
  loadQuotes();
  populateCategories();
  loadLastFilter();
};
