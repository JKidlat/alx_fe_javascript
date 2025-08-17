// Initial data for the quotes. Each quote is an object with a text and category.
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Life" },
  { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" },
  { text: "Believe you can and you're halfway there.", category: "Belief" },
];

// Get references to the necessary DOM elements
const newQuoteBtn = document.getElementById('newQuote');
const quoteTextElement = document.getElementById('quoteText');
const quoteAuthorElement = document.getElementById('quoteAuthor');
const controlsContainer = document.getElementById('controlsContainer');

/**
 * Displays a random quote from the quotes array.
 * This function is now correctly named "displayRandomQuote" as requested.
 */
function displayRandomQuote() {
  // Check if there are any quotes to display
  if (quotes.length === 0) {
    quoteTextElement.innerHTML = "No quotes available. Add some!";
    quoteAuthorElement.innerHTML = "";
    return;
  }
  
  // Logic to select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Logic to update the DOM using innerHTML
  quoteTextElement.innerHTML = `"${randomQuote.text}"`;
  quoteAuthorElement.innerHTML = `- ${randomQuote.category}`;
}

/**
 * Handles adding a new quote from the form inputs.
 * This function is now correctly referenced in the event listener.
 */
function addQuote(newQuoteText, newQuoteCategory) {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  
  // Basic validation to ensure both fields are filled
  if (text === "" || category === "") {
    console.error("Please enter both a quote and a category.");
    return;
  }
  
  // Logic to add a new quote to the quotes array
  const newQuote = {
    text: text,
    category: category
  };
  
  quotes.push(newQuote);
  
  // Clear the input fields after adding the quote
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  // Update the DOM to show the new quote
  displayRandomQuote();
}

/**
 * Dynamically creates the form to add a new quote and appends it to the DOM.
 */
function createAddQuoteForm() {
  // Create a container div for the form
  const formDiv = document.createElement('div');
  formDiv.className = 'bg-white p-4 rounded-lg shadow-inner';
  
  // Create the heading for the form
  const heading = document.createElement('h2');
  heading.className = 'text-lg font-semibold text-gray-700 mb-4';
  heading.innerHTML = 'Add a New Quote';

  // Create an inner div for spacing the form elements
  const innerDiv = document.createElement('div');
  innerDiv.className = 'space-y-4';

  // Create the quote text input field
  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.placeholder = 'Enter a new quote';
  newQuoteTextInput.className = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200';
  
  // Create the quote category input field
  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.placeholder = 'Enter quote category';
  newQuoteCategoryInput.className = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200';

  // Create the "Add Quote" button
  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.id = 'addQuote';
  addQuoteBtn.className = 'w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md';
  addQuoteBtn.innerHTML = 'Add Quote';
  
  // Append the input fields and button to the inner div
  innerDiv.appendChild(newQuoteTextInput);
  innerDiv.appendChild(newQuoteCategoryInput);
  innerDiv.appendChild(addQuoteBtn);

  // Append the heading and inner div to the form container
  formDiv.appendChild(heading);
  formDiv.appendChild(innerDiv);
  
  // Append the entire form to the main controls container
  controlsContainer.appendChild(formDiv);

  // Add event listener to the dynamically created button
  addQuoteBtn.addEventListener('click', () => {
    addQuote(newQuoteTextInput, newQuoteCategoryInput);
  });
}

// Add event listener on the “Show New Quote” button
newQuoteBtn.addEventListener('click', displayRandomQuote);

// Call the functions on page load to set everything up
window.onload = () => {
  displayRandomQuote();
  createAddQuoteForm();
};
