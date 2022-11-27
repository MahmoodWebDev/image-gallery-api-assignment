// API key
const auth = "";

//Defining my variables.  Input Text, Search button and Next page.
const input = document.querySelector("input");
const searchbutton = document.querySelector(".searchbutton");
const next = document.querySelector(".next");

//Show Gallery variables.
const showGalleryBtn = document.querySelector(".show-gallery");
const likeImages = [];
const galleryImages = [];
let showingLiked = false;

// Variables for page number, search and query.
let pagernr = 1;
let search = false;
let query = "";

// Input Text Prevent Default.
input.addEventListener("input", (e) => {
  e.preventDefault();
  query = e.target.value;
});

// When clicking Show Gallery button it will loop through selected image and show them one by one.
showGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (showingLiked) {
    showingLiked = false;
    CuratedPhotos(0);
  } else {
    showingLiked = true;
    document.querySelector(".gallery").innerHTML = "";
    likeImages.forEach((photo) => {
      const pic = document.createElement("div");
      pic.innerHTML = `<img onClick="addToSelected('${photo}')" src = ${photo}> <p>Photo: Photographer</p>
    <a href=${photo}>Download</a>
    `;
      document.querySelector(".gallery").appendChild(pic);
    });
  }
});

// Function for selected images.
function addToSelected(e) {
  const { src } = e;
  console.log(e);
  console.log(e.src);
  if (likeImages.indexOf(src) > -1) {
    likeImages.splice(likeImages.indexOf(src), 1);
    e.classList.remove("selected-img");
  } else {
    e.classList.add("selected-img");
    likeImages.push(src);
  }
  console.log(likeImages);
  console.log(likeImages.length);
}

// Function for first load of page showing one default picture.
async function CuratedPhotos(pagenr) {
  const data = await fetch(
    `https://api.pexels.com/v1/curated?per_page=0&page=${pagenr}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    }
  );
  const result = await data.json();
  result.photos.forEach((photo) => {
    const pic = document.createElement("div");
    // addToSelected('${photo.src.large}')
    const selected = likeImages.indexOf(photo.src.large) > -1;
    pic.innerHTML = `<img class="${
      selected ? "selected-img" : ""
    }" onClick="addToSelected(this)" src = ${photo.src.large}> <p>Photo: ${
      photo.photographter
    }</p>
    <a href=${photo.src.large}>Download</a>
    `;
    document.querySelector(".gallery").appendChild(pic);
  });
}

// Function for searching and fetching images via API.
async function SearchPhotos(query, pagenr) {
  const data = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${pagenr}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    }
  );
  const result = await data.json();
  result.photos.forEach((photo) => {
    galleryImages.push();
    const pic = document.createElement("div");
    pic.innerHTML = `<img src = ${photo.src.large} onClick="addToSelected(this)"> <p>Photo: ${photo.photographer}</p>
    <a href=${photo.src.large}>Download</a>
    `;
    document.querySelector(".gallery").appendChild(pic);
  });
}

// Event when clicking Search button.
searchbutton.addEventListener("click", () => {
  if (input.value === "") return;
  clear();
  search = true;
  SearchPhotos(query, pagernr);
  pagernr++;
});

function clear() {
  input.value = "";
  document.querySelector(".gallery").innerHTML = "";
  pagernr = 1;
}

// Event for clicking Next Page button.
next.addEventListener("click", () => {
  if (!search) {
    pagernr++;
    CuratedPhotos(pagernr);
  } else {
    if (query.valueOf === "") return;
    pagernr++;
    SearchPhotos(query, pagernr);
  }
});
CuratedPhotos(pagernr);
