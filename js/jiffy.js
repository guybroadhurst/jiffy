// this is our giphy api key
const API_KEY = 'KUPHL0mhWTh7QxcCXBvxFTi3a2uiSX4u'
// this gets our search input element
const searchEl = document.querySelector('.search-input')
// this is the hint element at the bottom of the page
const hintEL = document.querySelector('.search-hint')
// this is our video container div
const videosEl = document.querySelector('.videos')
// this is for our clear search button
const clearEl = document.querySelector('.search-clear')

// this returns a random result from an array
const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

// this creates a new video element when we pass in a src attribute
const createVideo = src => {
  const video = document.createElement('video')
  video.src = src
  video.autoplay = true
  video.muted = true
  video.loop = true
  video.className = 'video'

  return video
}

// this adds a class to the body which makes the spinner element visible while loading
const toggleLoading = state => {
  // in here we toggle the page loading state between loading & not loading
  // if our state is true we add a loading class to our body
  if (state) {
    document.body.classList.add('loading')
    // here we disable the input so users can't interfere
    searchEl.disabled = true
  } else {
    // otherwise we remove it
    document.body.classList.remove('loading')
    // here we enable the input field again
    searchEl.disabled = false
    searchEl.focus()
  }
}

// this clears the search results and empties the search input
// returning the page back to it's original state
const clearSearch = event => {
  // remove the 'has-results' class from the page
  document.body.classList.remove('has-results')
  // empty the videos element
  videosEl.innerHTML = ''
  // empty the hint text
  hintEL.innerHTML = ''
  // empty the search input value
  searchEl.value = ''
  // focus the cursor back into the search input
  searchEl.focus()
}

const searchGiphy = (searchTerm) => {
  // toggle the loading screen so the user knows something is happening
  toggleLoading(true)

  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`
  )
    .then((response) => {
      // Convert to JSON
      return response.json()
    })
    .then((json) => {
      // json is a big piece of json data that we can then work with
      // here we call the randomChoice function to give us
      // a random result from the array of images
      const gif = randomChoice(json.data)
      // here we look inside the result and grab the original mp4 source
      const src = gif.images.original.mp4

      // here we ue our createVideo function passing in the src attribute
      // and it gives us back a video element
      const video = createVideo(src)

      // here we grab our videos element and append our newly created video element
      videosEl.appendChild(video)

      // here we listen out for the video loaded event to fire
      // when it's loaded we'll display it on the page using a class
      // that triggers a transition effect
      video.addEventListener('loadeddata', (event) => {
        // this toggles the fading in effect of our videos
        video.classList.add('visible')
        // this toggles off the loading state
        toggleLoading(false)
        // this adds a 'has-results' class to toggle the close button
        document.body.classList.add('has-results')
        // change the hint text to 'see more results'
        hintEL.innerHTML = `Hit enter to see more ${searchTerm}`
      })
    })
    .catch((error) => {
      // this runs if there is an error in the fetch

      // here we toggle the loading state so that it is disabled
      toggleLoading(false)

      // here we tell the user nothing was found
      hintEL.innerHTML = `Nothing found for ${searchTerm}`

    })
}


const doSearch = (event) => {
  // this gets the value of the input from the search input element
  const searchTerm = searchEl.value

  // if we type more than 2 characters into the search element run this
  if (searchTerm.length > 2) {
    // add the .show-hint class to the body
    // this will show the hint at the bottom using CSS
    document.body.classList.add('show-hint')
    // here we change the string in the element to add what has been inputted
    hintEL.innerHTML = `Hit enter to search ${searchTerm}`
  } else {
    // remove the class if there isn't more than 2 characters in the search input
    document.body.classList.remove('show-hint')
  }

  if (event.key === 'Enter' && searchEl.value.length > 2) {
    // when the user hits enter, run the searchGiphy function with their searchTerm
    searchGiphy(searchTerm)
  }
}

// listen for when the user types in the search input
searchEl.addEventListener('keyup', doSearch)

// fire the clear search function when the user clicks the clear button
clearEl.addEventListener('click', clearSearch)
// fire the clear search function when the use presses the escape key
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    clearSearch()
  }
})