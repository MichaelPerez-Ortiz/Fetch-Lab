const { Carousel } = bootstrap

import { createCarouselItem, clear, appendCarousel, start } from "./Carousel.js";

// import axios from "axios";


// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

const body = document.querySelector("body");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "";

axios.defaults.headers["x-api-key"] = API_KEY;
axios.defaults.baseURL = "https://api.thecatapi.com/v1"
axios.defaults.onDownloadProgress = updateProgress


//Steps 5 ,6 and 7

axios.interceptors.request.use(config => {
  config.metadata = config.metadata || {};
  config.metadata.startTime =  new Date();
  console.log("Request started");
  progressBar.style.width = "0%"; 
  body.style.cursor = "progress"; 
  return config;
});


axios.interceptors.response.use(response => {
  console.log(`Request completed in ${new Date() - response.config.metadata.startTime}ms`);
  body.style.cursor = "default"; 
 
  return response;
});


function updateProgress(progressEvent) {
    progressBar.style.width = `${100}%`;
}



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
    axios.get(`/images/search?breed_id=${breedId}&limit=10` , {
      onDownloadProgress: updateProgress
    }),

    axios.get(`/breeds/${breedId}` , {
      onDownloadProgress: updateProgress
    })

  ]);

  console.log(jsonData2);
  console.log(jsonData3);

  
 if (jsonData2.length === 0) {
    
   let noImage = document.createElement("div");
    noImage.textContent = "No Image";
    noImage.style.fontSize = "2em";
    noImage.style.textAlign = "center";
    noImage.style.marginTop = "5%"; 
    noImage.style.marginBottom = "20%"; 
    infoDump.parentNode.insertBefore(noImage, infoDump);

  } else {

    let { data: favorites} = await axios.get("/favourites");
   
jsonData2.forEach(image => {
  let carouselItem = createCarouselItem(
    image.url ,
    jsonData3.name ,
    image.id ,
    favorites.some(fav => fav.image_id === image.id)
  );
  appendCarousel(carouselItem);
});
  }

start();

updateInfo(jsonData3);

}



//Info

function updateInfo(breedInfo) {


//Step10

if (!breedInfo) {
    infoDump.innerHTML = "<p> <strong> No information available. </strong> </p>";
    return; // Exit the function if there's no breed info
  }

  infoDump.innerHTML = `
    <h1> ${breedInfo.name || "N/A"} </h1>
    <h4> <strong> Origin: </strong> ${breedInfo.origin || "N/A"} </h4>
    <h6> <strong> Temperament: </strong> ${breedInfo.temperament || "N/A"} </h6>
    <h6> <strong> Description: </strong> ${breedInfo.description || "N/A"} </h6>
    <h6> <strong> Life Span: </strong> ${breedInfo.life_span || "N/A"} years </h6>
    <div class="characteristics">
        <h5> <strong> Characteristics </strong> </h5>
        <h6> <strong> Affection Level: </strong> ${breedInfo.affection_level || "N/A"}/5 </h6>
        <h6> <strong> Energy Level: </strong> ${breedInfo.energy_level || "N/A"}/5 </p>
        <h6> <strong> Intelligence: </strong> ${breedInfo.intelligence || "N/A"}/5 </h6>
    </div>
  `;
}




//Step8


export async function favourite(imgId) {
 
    let favImages = await axios.get("/favourites");
    let favorites = favImages.data;
    let favorited = favorites.find(fav => fav.image_id === imgId);

     const heartButton = document.querySelector(`[data-img-id="${imgId}"]`);

  if (favorited) {
    await axios.delete(`/favourites/${favorited.id}`);
    console.log("Removed from favorites");

    heartButton.classList.remove("favorited")

  } else {
    
      await axios.post("/favourites", {
        image_id: imgId
    });
      console.log("Added to favorites");

     heartButton.classList.add("favorited")

  }
}

//Step9

breedSelect.addEventListener("click", function() {
    if (infoDump.innerHTML === '') {  
        breeds(this.value); 
    }
});


getFavouritesBtn.addEventListener("click", getFavorites);



  async function getFavorites() {

    infoDump.innerHTML = "";
    
    let favData = await axios.get("/favourites");
    let favr = favData.data;
      
      clear();
      
      
    let favs = await Promise.all(
      favr.map(async fav => {
        let imageResponse = await axios.get(`/images/${fav.image_id}`);
        return imageResponse.data;
      })
    );

      favs.forEach(image => {
        let carouselItem = createCarouselItem(
          image.url,
          "Favorite Cat",
          image.id
      );
        appendCarousel(carouselItem);
    });

      start();
}



// Initialize the app
initialLoad();