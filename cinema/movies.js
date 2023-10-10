// keyList: has to be changed if new movie groups are added or removed !
const keyList = ["allMovies", "jasonBourne", "piratesOfTheCaribbean", "harryPotter", "starWars"];

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

            setUpTimer(currentObject.dateTime);
          }
        }
      }

      // title not found

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
      document.getElementById("timer").innerHTML = "NICHTS GEPLANT";
      document.getElementById("cinemaAndTime").classList.remove("ani-accent-fade");
      document.getElementById('movieTime').innerHTML = " - - : - - ";
      document.getElementById('movieDay').innerHTML = "- ? -";
      nextMovieDefault();
    }
  }, 1000);
}

function nextMovieDefault(){
  document.getElementById("nextMovieTitle").innerHTML = "";
  document.getElementById('nextMovieDetails').innerHTML = "Durchsuche die Liste nach einem Film deiner Wahl oder entscheide Vorort";
  document.getElementById('nextMovieActors').innerHTML = "";
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
        buildScrollElement("searchResultScroll", element.imdbCoverId, element.title);
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
    buildScrollElement("allMoviesScroll", element.imdbCoverId, element.title)
  };

  // display jason bourne list
  for (const element of jbList) {
    buildScrollElement("jasonBourneScroll", element.imdbCoverId, element.title)
  };

  addBourneOnClick("diebourneidentität", "Die Boerne Identität");
  addBourneOnClick("diebourneverschwörung", "Die Münster Verschwörung");
  addBourneOnClick("dasbourneultimatum", "Das Thiel Ultimatum");
  addBourneOnClick("dasbournevermächtnis", "Das Alberich Vermächtnis");
  addBourneOnClick("jasonbourne", "Prof. Dr. Dr. Karl-Friedrich Boerne");

  // display pirates of the caribbean list
  for (const element of potcList) {
    buildScrollElement("potcScroll", element.imdbCoverId, element.title)
  };

  // display harry potter list
  for (const element of hpList) {
    buildScrollElement("harryPotterScroll", element.imdbCoverId, element.title)
  };

  // display star wars list
  for (const element of swList) {
    buildScrollElement("starWarsScroll", element.imdbCoverId, element.title)
  };

}).catch(function(error){
  console.error(error);
})

function buildScrollElement(targetElement, image, title){
  var newMediaElement = document.createElement("div");
  newMediaElement.id = title.replace(/\s+/g, '').toLowerCase();
  newMediaElement.classList.add("media-element");

  var newMediaImage = document.createElement("img");
  newMediaImage.loading = "lazy";
  newMediaImage.src = "https://m.media-amazon.com/images/M/" + image + ".jpg";
  newMediaElement.appendChild(newMediaImage);

  var newMediaDiv = document.createElement("div");
  var newMediaP = document.createElement("p");
  newMediaP.classList.add("media-scroll-title");
  newMediaP.innerText = title;
  newMediaDiv.appendChild(newMediaP);

  newMediaElement.appendChild(newMediaDiv);

  document.getElementById(targetElement).appendChild(newMediaElement);
}


function addBourneOnClick(element, text){
  var e = document.getElementById(element).children[1].children[0];
  e.onclick = function () { e.innerText = text; e.classList.add("boerne"); };
}
