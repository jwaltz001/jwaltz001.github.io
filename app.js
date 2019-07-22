$(() => {
//===============Global Variables=======================
    //===========API URL Variables================
let bgaUrlInsert = "";
let selectedGames = [];
//===============Objects with commonly used code=======================
//good place for constructor?
const makeDomElement = {
  makeDiv: (parentElement, elementClass, elementId) => {
    $(parentElement).append("<div class ="+elementClass+" id = "+elementId+">");
  },
  makeH1: (parentElement, elementClass, elementId, elementText) => {
    $(parentElement).append("<h1 class ="+elementClass+" id = "+elementId+">"+elementText+"</h1>");
  },
  makeBtn: (parentElement, elementClass, elementId, elementValue, elementText) => {
    $(parentElement).append("<button class ="+elementClass+" id = "+elementId+" value = "+elementValue+">"+elementText+"</button>");
  },
  makeImg: (parentElement, elementSrc , elementId) => {
    $(parentElement).append("<img src ="+elementSrc+" id = "+elementId+">");
  },
  makeDl: (parentElement, elementClass, elementId) => {
    $(parentElement).append("<dl class ="+elementClass+" id = "+elementId+">");
  },
  makeDt: (parentElement, elementText) => {
    $(parentElement).append("<dt>"+elementText+"</dt>");
  },
  makeDd: (parentElement, elementText) => {
    $(parentElement).append("<dd>"+elementText+"</dd>");
  }
};

//===============Search Div=============================
const switchArrow = () => {
  const arrow = $("#about-tab-arrow");
  console.log(arrow);
  const arrowClass = $("#about-tab-arrow").hasClass("upside-down-arrow");
  console.log(arrowClass);
  if (arrowClass == false) {
    $("#about-text").slideDown("slow");
    arrow.addClass("upside-down-arrow");
  }else{
    $("#about-text").slideUp("slow");
    arrow.removeClass("upside-down-arrow");
  }
};

//===============API Call Functions=============================
    //=======Search Call=========
const getBgaSearchResults = () => {
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          for (var i = 0; i < 10; i++) {
            const resultName = data.games[i].name;
            const $resultPrintOut = $("<button id=result"+i+" value="+data.games[i].id+">"+resultName+"</button>");
            $(".results-display").append($resultPrintOut);
            $($resultPrintOut).on("click", getGameInfo);
          }
        },
        (error) => {
          console.log(error);
        }
      );
};

    //=======Game display call=========
const getGameInfo = (event) => {
  const $gameId = $(event.target).val();
  bgaUrlInsert = "https://www.boardgameatlas.com/api/search?ids="+$gameId+"&client_id=tIPZB6stZR";
  $.ajax({
        url: bgaUrlInsert,
        //is "type" necessary?
        //type: "GET"
      }).then(
        (data) => {
          const selectedObj = data.games[0];
          //console.log(selectedObj);
          selectedGames.push(selectedObj);
          const selectedGameIndex = selectedGames.length-1;
          const $newCardContainer = $(".game-display-area").prepend("<div class = 'display-card-container' id = 'card-container" + selectedGameIndex+"'</div>");
          makeDomElement.makeDiv("#card-container" + selectedGameIndex,"display-cards","display-card" + selectedGameIndex);
          const idForCard = "#display-card" + selectedGameIndex;
          makeDomElement.makeH1(idForCard,"card_h1","title-game" + selectedGameIndex, selectedObj.name);
          makeDomElement.makeImg(idForCard, selectedObj.thumb_url, "image-game"+ selectedGameIndex);
          makeDomElement.makeDl(idForCard, "game_card_dl", "game_card_dl"+ selectedGameIndex);
          const idForList = "#game_card_dl"+ selectedGameIndex;
          makeDomElement.makeDt(idForList, "Year Published");
          makeDomElement.makeDd(idForList, selectedObj.year_published);
          makeDomElement.makeDt(idForList, "Number of players");
          makeDomElement.makeDd(idForList, "Min: " + selectedObj.min_players + "  Max: " + selectedObj.max_players);
          makeDomElement.makeDt(idForList, "Playtime (in minutes)");
          makeDomElement.makeDd(idForList, "Min: " + selectedObj.min_playtime + "  Max: " + selectedObj.max_playtime);
          makeDomElement.makeDt(idForList, "Price (MSRP)");
          makeDomElement.makeDd(idForList, "$" + selectedObj.msrp);
          makeDomElement.makeDt(idForList, "Number of Mentions on /r/boardgames");
          makeDomElement.makeDd(idForList, selectedObj.reddit_all_time_count + " (Since Sept. 2018) || " + selectedObj.reddit_week_count + " (In the past week)");
          makeDomElement.makeDt(idForList, "Average Rating on Board Game Atlas");
          makeDomElement.makeDd(idForList, selectedObj.average_user_rating.toFixed(2));
          makeDomElement.makeBtn(idForCard, "choose-game-btn", "choose-game-btn"+selectedGameIndex, selectedGameIndex, "Choose");
          makeDomElement.makeBtn(idForCard, "info-game-btn", "info-game-btn"+selectedGameIndex, selectedGameIndex, "<a href = '#more-info-display'>More Info</a>");
          $("#card-container"+selectedGameIndex).toggle("slow", "linear");
          $(".choose-game-btn").on("click", passWinnerToDisplay);
          $(".info-game-btn").on("click", getMoreInfo);
        },
        (error) => {
          console.log(error);
        }
      );
};

    //=======More info call=========
const getMoreInfo = (event) => {
  console.log("clicked");
  const $gameArrIndex = $(event.currentTarget).val();
  console.log($gameArrIndex);
  const $infoModal = $("#info-modal-textbox");
  $("#more-info-display").append($infoModal);
  $("#info-title").text(selectedGames[$gameArrIndex].name);
  $("#info-image").attr("src", selectedGames[$gameArrIndex].images.small);
  $("#info-description").text(selectedGames[$gameArrIndex].description_preview);
  $("#info-rules").attr("href", selectedGames[$gameArrIndex].rules_url);
  $("#info-website").attr("href", selectedGames[$gameArrIndex].official_url);
  $("#info-close").attr("value", $gameArrIndex);
  $("#info-close").on("click", closeMoreInfo);
  getVideo($gameArrIndex);
  $($infoModal).css("display","block");
  //**************** insert game videos***************
};

const getVideo = ($gameArrIndex) => {
  const $gameId = selectedGames[$gameArrIndex].id;
  bgaUrlInsert = "https://www.boardgameatlas.com/api/game/videos?limit=3&game_id="+$gameId+"&youtube_id&client_id=tIPZB6stZR";
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          //console.log(data);
          for (var i = 0; i < data.videos.length; i++) {
            const watchUrl = data.videos[i].url;
            const arrWithYoutubeId = watchUrl.split("=");
            $("#info-video"+i).attr("src", "https://www.youtube.com/embed/"+ arrWithYoutubeId[1]);
            $(".info-video-div").children("p").eq(i).text(data.videos[i].title);
          }
  //could filter vids by channel or do the original call with the "include_game" parameter attached
        });
  };

const closeMoreInfo = (event) => {
  const $gameArrIndex = $(event.target).val();
  $("#info-modal-textbox").css("display","none");
  $("#info-image").attr("src","");
  $("#info-website").attr("href","");
  $("#info-rules").attr("href","");
  $("iframe").attr("src","");
};
//Figure out how to stop video on close
//put close on info modal (background)?

//=======================Choose Winner functions=========================
const passWinnerToDisplay = () => {
  const winner = $(event.target).val();
  displayWinner(winner);
};
const displayWinner = (winner) => {
  const $winnerModal = $("<div>").attr("id","winner-modal");
  $("body").append($winnerModal);
  const $winnerModalTextbox = $("<div>").attr("id","winner-modal-textbox");
//could use obj to make now
  $winnerModalTextbox.append("<h2>And the winner is...");
  $winnerModalTextbox.append("<h1>"+selectedGames[winner].name);
  $winnerModalTextbox.append("<img src="+selectedGames[winner].images.large+">");
  const $winnerDl = $("<dl>");
  $winnerModalTextbox.append($winnerDl);
  $winnerDl.append("<dt id='winner-designers'>Designed by</dt>");
  $winnerDl.append("<dd>" + selectedGames[winner].designers + "</dd>");
  const $closeBtn = $("<button id='winner-modal-close'>Close</button>");
  $closeBtn.on("click", () => {
    $("#winner-modal").toggle(500);
    $(".game-display-area").css({"transform": "scale(1)", "transition-duration": "3s"});
  });
  $winnerModalTextbox.append($closeBtn);
  $winnerModal.append($winnerModalTextbox);
  $winnerModal.toggle(500);
};
//=======================Choose for me function=========================
const selectRandomGame = () => {
  const randChoice = Math.floor(Math.random() * selectedGames.length);
  return randChoice;
};
const positionDiceAndView = (winner) => {
  $(".game-display-area").css({"transform": "scale(.8)", "transition-duration": "3s"});
  window.scrollBy(0, -300);
  $("#dice-roll-img").attr("class", "clicked-random");
  setTimeout(() => {
    $("#dice-roll-img").attr("class", "");
    displayWinner(winner);
  },
  5000);
};

//=======================Starting Event Listeners=========================
$(".randomizer-button").on("click", () => {
  positionDiceAndView(selectRandomGame());
});
$(".arrow-down-btn").on("click", switchArrow);
$(".search-form").on("submit", (event) => {
    event.preventDefault();
    $(".results-display").empty();
    const searchTerms = $("#search-input").val();
    bgaUrlInsert = "https://www.boardgameatlas.com/api/search?name="+searchTerms+"&limit=10&client_id=tIPZB6stZR";
    getBgaSearchResults();
  });

});
