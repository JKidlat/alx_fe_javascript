// Initial data for the quotes. Each quote is an object with a text and category.
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Life" },
  { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" },
  { text: "Believe you can and you're halfway there.", category: "Belief" },
];

// Get references to all the necessary DOM elements
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuote');
const quoteTextElement = document.getElementById('quoteText');
const quoteAuthorElement = document.getElementById('quoteAuthor');

/**
 * Displays a random quote from the quotes array.
 */
function displayRandomQuote() {
  // Check if there are any quotes to display
  if (quotes.length === 0) {
    quoteTextElement.textContent = "No quotes available. Add some!";
    quoteAuthorElement.textContent = "";
    return;
  }
  
  // Get a random index from the quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Update the quote and author elements with the new content
  quoteTextElement.textContent = `"${randomQuote.text}"`;
  quoteAuthorElement.textContent = `- ${randomQuote.category}`;
}

/**
 * Handles adding a new quote from the form inputs.
 */
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  
  // Basic validation to ensure both fields are filled
  if (text === "" || category === "") {
    // Note: Replaced alert() with a console log for a better user experience in the iframe environment
    console.error("Please enter both a quote and a category.");
    return;
  }
  
  // Create a new quote object and add it to the quotes array
  const newQuote = {
    text: text,
    category: category
  };
  
  quotes.push(newQuote);
  
  // Clear the input fields after adding the quote
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  // Display the new quote immediately or a new random quote
  displayRandomQuote();
}

// Add event listeners to the buttons
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Display an initial quote when the page loads
window.onload = displayRandomQuote;
