// keyList: has to be changed if new movie groups are added or removed !
const keyList = ["allMovies", "jasonBourne", "piratesOfTheCaribbean", "harryPotter", "starWars"];

const imdbLinkPrefix = "https://www.imdb.com/title/";

getCurrentMovie();

function getCurrentMovie(){
  // fetch current movie data
  fetch("data/current.json").then(function(response){
    return response.json();

  }).then(function(currentObject){
    // Success condition

    // fetch all movies
    fetch("data/movies.json").then(function(response){
      return response.json();
    }).then(function(object){
      // Success condition for all movies file

      var found = false;
      // get each list
      for (const key of keyList) {
        // iterate all lists and iterate each list for search string
        for (const element of object[key]) {

          if (element.title === currentObject.title) {
            // title found
            var d = "2D";
            if (element.is3d){
              d = "3D";
            }

            document.getElementById("nextMovieTitle").innerHTML = element.title;
            document.getElementById("nextMovieDetails").innerHTML = element.year + " | " + element.length + " Minuten | " + d;
            document.getElementById("nextMovieActors").innerHTML = "Mit: " + element.actors[0] + " & " + element.actors[1];
            document.getElementById("nextMovieImage").src = "https://m.media-amazon.com/images/M/" + element.imdbCoverId + ".jpg";

            found = true;
            break;
          }
        }
      }

      // title not found
      if (!found){
        nextMovieDefault();
      }
      setUpTimer(currentObject.dateTime);

    }).catch(function(error){
      // Error condition for all movies, abort process
      console.error(error);
    });
  }).catch(function(error){
    // Error condition
    console.error(error);
  });
}

function setUpTimer(movieDateTime){

  nextTimeDefault();

  // var dateObj = new Date("Oct 4, 2023 17:00:00")
  var dateObj =  new Date(movieDateTime);
  var countDownDate = dateObj.getTime();

  var dateCode = dateObj.getDay();
  switch (dateCode){
    case 0:
      dateCode = "Sonntag";
      break;
    case 1:
      dateCode = "Montag";
      break;
    case 2:
      dateCode = "Dienstag";
      break;
    case 3:
      dateCode = "Mittwoch";
      break;
    case 4:
      dateCode = "Donnerstag";
      break;
    case 5:
      dateCode = "Freitag";
      break;
    case 6:
      dateCode = "Samstag";
      break;
  }
  document.getElementById('movieDay').innerHTML = dateCode;

  var targetHours = dateObj.getHours();
  var targetMinutes = dateObj.getMinutes();
  var hourFill = "0";
  var minuteFill = "0";
  if (targetHours >= 10){
    hourFill = ""
  }
  if (targetMinutes >= 10){
    minuteFill = ""
  }
  document.getElementById('movieTime').innerHTML = hourFill + targetHours + " : " + minuteFill + targetMinutes;

  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var d = "0"
    if(days >= 10){
      d = ""
    }
    var h = "0"
    if (hours >= 10) {
      h = ""
    }
    var m = "0"
    if (minutes >= 10) {
      m = ""
    }
    var s = "0"
    if (seconds >= 10) {
      s = ""
    }

    document.getElementById("timer").innerHTML = d + days + "d " + h + hours + "h "
      + m + minutes + "m " + s + seconds + "s ";

    if (distance < 0) {
      document.getElementById("timer").innerHTML = "L Ä U F T";
      document.getElementById("cinemaAndTime").classList.add("ani-accent-fade");
    }

    if (distance < -18013433) { // about 6 hours
      clearInterval(x);
      document.getElementById("nextMovieImage").src = "";
      nextMovieDefault();
      nextTimeDefault();
    }
  }, 1000);
}

function nextMovieDefault(){
  document.getElementById("nextMovieTitle").innerHTML = "";
  document.getElementById('nextMovieDetails').innerHTML = "Durchsuche die Liste nach einem Film deiner Wahl oder entscheide Vorort";
  document.getElementById('nextMovieActors').innerHTML = "";
  var e = document.getElementById("nextMovieImage");
  e.src = 'https://cdn-icons-png.flaticon.com/512/2476/2476231.png';
  e.onclick = function () {
    e.classList.add("opacity-fade");
    e.src = "https://i.giphy.com/media/oa4Au5xDZ6HJYF6KGH/giphy.webp";
  };
}

function nextTimeDefault(){
  document.getElementById("timer").innerHTML = "NICHTS GEPLANT";
  document.getElementById("cinemaAndTime").classList.remove("ani-accent-fade");
  document.getElementById('movieTime').innerHTML = " - - : - - ";
  document.getElementById('movieDay').innerHTML = "- ? -";
}

function searchMovie(searchString){
  document.getElementById("searchResultScroll").replaceChildren();
  if(searchString == ""){
    document.getElementById("searchResultsContainer").hidden = true;
    return;
  }
  searchString = searchString.toLowerCase();
  var results = [];

  // fetch all movies
  fetch("data/movies.json").then(function(response){
    // return as json object
    return response.json();
  }).then(function(object){
    // success condition

    // get each list
    for(const key of keyList){
      // iterate all lists and iterate each list for search string
      for(const element of object[key]){

        if ((element.title).toLowerCase().indexOf(searchString) >= 0||
          (element.year).toString().toLowerCase().indexOf(searchString) >= 0 ||
          (element.actors[0]).toLowerCase().indexOf(searchString) >= 0 ||
          (element.actors[1]).toLowerCase().indexOf(searchString) >= 0){
            results.push(element);
          }
      }
    }

    // evaluate
    if(results.length >= 1){
      // display results
      for (const element of results) {
        buildScrollElement("searchResultScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack);
      };
      document.getElementById("searchResultsContainer").hidden = false;
    }else{
      // display error
      var newNode = document.createElement("div");
      newNode.classList.add("scroll-title-container");
      newNode.innerHTML = "Keine Ergebnisse";
      document.getElementById("searchResultsContainer").appendChild(newNode);
      document.getElementById("searchResultsContainer").hidden = false;
    }


  }).catch(function(error){
    // error condition
    console.error(error);
  })
}

document.getElementById("searchBox").addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    event.preventDefault();
    document.getElementById("submitBtn").click();
  }
});


var movieList = [];

// fetch movie list
fetch("data/movies.json").then(function(response){
  return response.json();
}).then(function(object){
  movieList = object.allMovies;
  jbList = object.jasonBourne;
  potcList = object.piratesOfTheCaribbean;
  hpList = object.harryPotter;
  swList = object.starWars;

  // display allmovies list
  for (const element of movieList) {
    buildScrollElement("allMoviesScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack, element.is3d, element.length, element.actors[0], element.actors[1], element.year);
  };

  // display jason bourne list
  for (const element of jbList) {
    buildScrollElement("jasonBourneScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack, element.is3d, element.length, element.actors[0], element.actors[1], element.year)
  };

  // display pirates of the caribbean list
  for (const element of potcList) {
    buildScrollElement("potcScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack, element.is3d, element.length, element.actors[0], element.actors[1], element.year)
  };

  // display harry potter list
  for (const element of hpList) {
    buildScrollElement("harryPotterScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack, element.is3d, element.length, element.actors[0], element.actors[1], element.year)
  };

  // display star wars list
  for (const element of swList) {
    buildScrollElement("starWarsScroll", element.imdbCoverId, element.title, element.imdbLinkId, element.isStack, element.is3d, element.length, element.actors[0], element.actors[1], element.year)
  };

  easterEggs();

}).catch(function(error){
  console.error(error);
})

function buildScrollElement(targetElement, image, title, link, isStack, is3d, duration, actor1, actor2, year){
  var mainMediaElement = document.createElement("div");
  mainMediaElement.id = title.replace(/\s+/g, '').toLowerCase();
  mainMediaElement.classList.add("media-element");

  var cardTopElement = document.createElement("div");
  mainMediaElement.appendChild(cardTopElement);

  var cardLeft = document.createElement("div");
  cardLeft.classList.add("card-half");
  cardTopElement.appendChild(cardLeft);

  var cardLink = document.createElement("a");
  if(isStack){
    cardLink.href = link;
  }else{
    cardLink.href = imdbLinkPrefix + link;
    cardLink.target = "_blank";
  }
  cardLeft.appendChild(cardLink);

  var cardImage = document.createElement("img");
  cardImage.loading = "lazy";
  cardImage.src = "https://m.media-amazon.com/images/M/" + image + ".jpg";
  if(isStack){
    cardImage.title = "Zur Einzelauswahl ➡";
  }else{
    cardImage.title = "Auf IMDB anschauen ➡";
  }
  cardLink.appendChild(cardImage);



  var cardRight = document.createElement("div");
  cardRight.classList.add("card-half");
  cardTopElement.appendChild(cardRight);

  var cardYear = document.createElement("div");
  cardYear.classList.add("card-details", "card-year");
  cardYear.innerHTML = "(" + year + ")";
  cardRight.appendChild(cardYear);

  var cardDimension = document.createElement("div");
  cardDimension.classList.add("card-details", "card-dimension");
  if(is3d){
    cardDimension.innerHTML = "3D";
  }else{
    cardDimension.innerHTML = "2D";
  }
  cardRight.appendChild(cardDimension);

  var cardDuration = document.createElement("div");
  cardDuration.classList.add("card-details", "card-duration");
  cardDuration.innerHTML = duration + " Minutes";
  cardRight.appendChild(cardDuration);

  var cardSeparator = document.createElement("div");
  cardSeparator.classList.add("card-details-separator");
  cardRight.appendChild(cardSeparator);

  cardSeparator.appendChild(document.createElement("hr"));

  var cardActor1 = document.createElement("div");
  cardActor1.classList.add("card-details");
  cardActor1.innerHTML = actor1;
  cardRight.appendChild(cardActor1);

  var cardActor2 = document.createElement("div");
  cardActor2.classList.add("card-details");
  cardActor2.innerHTML = actor2;
  cardRight.appendChild(cardActor2);



  var cardTitle = document.createElement("div");
  cardTitle.classList.add("card-title");
  mainMediaElement.appendChild(cardTitle);

  var cardTitleText = document.createElement("p");
  cardTitleText.innerText = title;
  cardTitleText.id = title.replace(/\s+/g, '').toLowerCase() + "_title";
  cardTitle.appendChild(cardTitleText);

  document.getElementById(targetElement).appendChild(mainMediaElement);
}


function addEasterEgg(element, text){
  var e = document.getElementById(element);
  e.classList.add("hint");
  e.onclick = function () { 
    e.innerText = text; 
    e.classList.add("flash-red");
    e.classList.remove("hint");
  };
}

function easterEggs(){
  addEasterEgg("diebourneidentität_title", "Die Boerne Identität");
  addEasterEgg("diebourneverschwörung_title", "Die Münster Verschwörung");
  addEasterEgg("dasbourneultimatum_title", "Das Thiel Ultimatum");
  addEasterEgg("dasbournevermächtnis_title", "Das Alberich Vermächtnis");
  addEasterEgg("jasonbourne_title", "Prof. Dr. Dr. Karl-Friedrich Boerne");


  addEasterEgg("2012dasendederwelt_title", "DIE MAYAS HATTEN RECHT! Oh ne doch noch nicht");
  addEasterEgg("johnwick_title", "Mit einem verschissenen Bleistift!");
  addEasterEgg("jurassicpark_title", "Ich habe keine Kosten gescheut!");
  addEasterEgg("daswundervonmanhattan_title", "DER WEIHNACHTS\nMANN!");
  addEasterEgg("nachtsimmuseum_title", "Dumm Dumm, gibst du mir Gum Gum?");
  addEasterEgg("startrek_title", "Wo noch nie ein Mensch zuvor gewesen ist");
  addEasterEgg("thegreatwall_title", "We need to build a wall!");
  addEasterEgg("xxx-triplex_title", "Ich steh auf so'n Scheiß!");
  addEasterEgg("starwars:episodeiii-dierachedersith_title", "I have the high ground!");
}
