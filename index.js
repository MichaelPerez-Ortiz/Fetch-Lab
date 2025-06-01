const { Carousel } = bootstrap

import { createCarouselItem, clear, appendCarousel, start } from "./Carousel.js";

import axios from "axios";


// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "";

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common = ["x-api-key"] = API_KEY;


//Step1

async function initialLoad() {
  let { data: jsonData} = await axios.get("/breeds");

  console.log(jsonData)
  

jsonData.forEach(breed => {
  let option = document.createElement("option");
  option.value = breed.id;
  option.innerText = breed.name;
  breedSelect.appendChild(option);
});

await breeds(breedSelect.value);

}



//Step2


breedSelect.addEventListener("change", async function() {
  await breeds(breedSelect.value);
});

async function breeds(breedId) {
clear();

  // let breedId = breedSelect.value;
  const [{ data: jsonData2 }, { data: jsonData3 }] = await Promise.all([
    axios.get(`/images/search?breed_id=${breedId}&limit=10`),
    axios.get(`/breeds/${breedId}`)
  ]);

  console.log(jsonData2);
  console.log(jsonData3);

  
jsonData2.forEach(image => {
  let carouselItem = createCarouselItem (
    image.url ,
    jsonData3.name ,
    image.id
  );
  appendCarousel(carouselItem);
});

start();

updateInfo(jsonData3);

}


//Info

function updateInfo(breedInfo) {
  infoDump.innerHTML = `
<h1> ${breedInfo.name} </h1>
    <h4> <strong> Origin: </strong> ${breedInfo.origin} </h4>
    <h6> <strong> Temperament: </strong> ${breedInfo.temperament} </h6>
    <h6> <strong> Description: </strong> ${breedInfo.description} </h6>
    <h6> <strong> Life Span: </strong> ${breedInfo.life_span} years </h6>
      <div class="characteristics">
          <h5> <strong> Characteristics </strong> </h5>
          <h6> <strong> Affection Level: </strong> ${breedInfo.affection_level}/5 </h6>
          <h6> <strong> Energy Level: </strong> ${breedInfo.energy_level}/5 </p>
          <h6> <strong> Intelligence: </strong> ${breedInfo.intelligence}/5 </h6>
      </div>
  `;
}

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */


// Initialize the app
initialLoad();