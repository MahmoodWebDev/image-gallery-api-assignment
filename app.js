// API key for images.
const API_KEY = "";

// DOM Elements
const searchInput = document.querySelector("input");
const searchButton = document.querySelector(".searchbutton");
const nextPageButton = document.querySelector(".next");
const showGalleryButton = document.querySelector(".show-gallery");

// Arrays to store liked and gallery images
const likedImages = [];
const galleryImages = [];

// Flags and data holders
let isShowingLikedImages = false;
let pageNumber = 1;
let isSearchActive = false;
let searchText = "";

// Event Listener for Search Input - updates search text
searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  searchText = e.target.value;
});

// Event Listener for Show Gallery Button - toggles between liked images and all images
showGalleryButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (isShowingLikedImages) {
    isShowingLikedImages = false;
    loadImages(pageNumber);
  } else {
    isShowingLikedImages = true;
    displayLikedImages();
  }
});

// Function to add/remove images from the liked images array
function toggleImageSelection(imageElement) {
  const { src } = imageElement;

  const imageIndex = likedImages.indexOf(src);
  if (imageIndex > -1) {
    likedImages.splice(imageIndex, 1);
    imageElement.classList.remove("selected-img");
  } else {
    imageElement.classList.add("selected-img");
    likedImages.push(src);
  }
}

// Function to display curated images when page loads
async function loadImages(pageNumber) {
  const data = await fetch(
    `https://api.pexels.com/v1/curated?per_page=0&page=${pageNumber}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    }
  );
  const result = await data.json();
  displayImages(result.photos);
}

// Function to search images via Pexels API
async function searchImages(searchText, pageNumber) {
  const data = await fetch(
    `https://api.pexels.com/v1/search?query=${searchText}&per_page=15&page=${pageNumber}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    }
  );
  const result = await data.json();
  displayImages(result.photos);
}

// Function to display images in the gallery
function displayImages(images) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  images.forEach((image) => {
    const imageElement = document.createElement("div");
    const isSelected = likedImages.includes(image.src.large);
    imageElement.innerHTML = `
      <img class="${isSelected ? "selected-img" : ""}" onClick="toggleImageSelection(this)" src="${image.src.large}">
      <p>Photo: ${image.photographer}</p>
      <a href="${image.src.large}">Download</a>
    `;
    gallery.appendChild(imageElement);
  });
}

// Function to display liked images in the gallery
function displayLikedImages() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  likedImages.forEach((imageSrc) => {
    const imageElement = document.createElement("div");
    imageElement.innerHTML = `
      <img class="selected-img" onClick="toggleImageSelection(this)" src="${imageSrc}">
      <p>Photo: Photographer</p>
      <a href="${imageSrc}">Download</a>
    `;
    gallery.appendChild(imageElement);
  });
}

// Event Listener for Search Button
searchButton.addEventListener("click", () => {
  if (searchInput.value === "") return;
  resetGallery();
  isSearchActive = true;
  searchImages(searchText, pageNumber);
  pageNumber++;
});

// Function to clear gallery and reset page number
function resetGallery() {
  searchInput.value = "";
  document.querySelector(".gallery").innerHTML = "";
  pageNumber = 1;
}

// Event Listener for Next Page Button
nextPageButton.addEventListener("click", () => {
  if (!isSearchActive) {
    pageNumber++;
    loadImages(pageNumber);
  } else {
    if (searchText === "") return;
    pageNumber++;
    searchImages(searchText, pageNumber);
  }
});

// Initial load of curated images
loadImages(pageNumber);
