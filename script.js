const form = document.querySelector(".js-search-form");
form.addEventListener("submit", handleSubmit);

//code for loading indicator comes from here: https://tobiasahlin.com/spinkit/

async function handleSubmit(event) {
  //Prevent page from being reloaded when empty input
  event.preventDefault();
  //get tyhe value of the input
  const userInput = document.querySelector(".js-search-input").value;

  //Remove white space from the input
  const searchQuery = userInput.trim();
  
    const searchResults = document.querySelector('.js-search-results');
  // Clear the previous results
  searchResults.innerHTML = '';

  const spinner = document.querySelector(".js-spinner");
  spinner.classList.remove("hidden");
  

  try {
    const results = await searchWikipedia(searchQuery);
    if (results.query.searchinfo.totalhits === 0) {
      alert("No results found");
      return
    }
    console.log(results);
    displayResults(results);
  }
  catch(err) {
    console.log(err);
    alert("Search not working at the moment")
  }
  finally {
    spinner.classList.add("hidden");
  }

  
}

async function searchWikipedia(searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }

  const json = await response.json();
  return json;
}

function displayResults(results) {
  //Get a refrence to the js search results class element
  const searchResults = document.querySelector(".js-search-results")
  //Iterate over the search array. Each nested object in the array can be accessed through the result parameter
  results.query.search.forEach(result=>{
    
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    //Append the search result to the DOM
   searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
    );
  });
}