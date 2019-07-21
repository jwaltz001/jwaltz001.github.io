//console.log($);
$(() => {
//===============Global Variables=======================
//===============Search Div=============================

$(".search-form").on("submit", (event) => {
    event.preventDefault();
    $(".results-display").empty();
    const searchTerms = $("#search-input").val();
    bgaUrlInsert = "https://www.boardgameatlas.com/api/search?name="+searchTerms+"&limit=10&client_id=tIPZB6stZR";
    getBgaSearchResults();
  });

//================API URL Variables=============================
let bgaUrlInsert = "";
//let resultsObj = {};
//let data1 = {};
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
let numOfGames = 0;
let selectedGames = [];
const getGameInfo = (event) => {
  const $gameId = $(event.target).val();
  bgaUrlInsert = "https://www.boardgameatlas.com/api/search?ids="+$gameId+"&client_id=tIPZB6stZR";
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          //console.log(data);
          const selectedObj = data.games[0];
          //console.log(selectedObj);
          selectedGames.push(selectedObj);
          $("#info-game-btn"+numOfGames).attr("value", numOfGames);
          $("#choose-game-btn"+numOfGames).attr("value", numOfGames);
          $("#title-game"+numOfGames).text(selectedObj.name);
          $("#image-game"+numOfGames).attr("src", selectedObj.thumb_url);
          $("#year-game"+numOfGames).text(selectedObj.year_published);
//good place for string interpolation?
          $("#players-game"+numOfGames).text("Min: " + selectedObj.min_players + "  Max: " + selectedObj.max_players);
          $("#playtime-game"+numOfGames).text("Min: " + selectedObj.min_playtime + "  Max: " + selectedObj.max_playtime);
          $("#price-game"+numOfGames).text("$" + selectedObj.msrp);
          $("#reddit-game"+numOfGames).text(selectedObj.reddit_all_time_count + " (Since Sept. 2018)" + "     " + selectedObj.reddit_week_count + " (In the past week)");
          $("#rating-game"+numOfGames).text(selectedObj.average_user_rating.toFixed(2));
          $("#display-card"+numOfGames).toggle(1000);
          numOfGames++;
        },
        (error) => {
          console.log(error);
        }
      );

};


    //=======More info call=========
const getMoreInfo = (event) => {
  const $gameArrIndex = $(event.target).val();
  $("#info-title").text(selectedGames[$gameArrIndex].name);
  $("#info-image").attr("src", selectedGames[$gameArrIndex].images.small);
  $("#info-description").text(selectedGames[$gameArrIndex].description_preview);
  $("#info-rules").attr("href", selectedGames[$gameArrIndex].rules_url);
  $("#info-website").attr("href", selectedGames[$gameArrIndex].official_url);
  $("#info-close").on("click", () => {
    $("#info-modal").hide();
//Figure out how to stop video on close
//put close on info modal (background)?
  });
  getVideo();
  $("#info-modal").show();
  //**************** insert game videos***************
};
$(".info-game-btn").on("click", getMoreInfo);

const passWinnerToDisplay = () => {
  const winner = $(event.target).val();
  displayWinner(winner);
};
$(".choose-game-btn").on("click", passWinnerToDisplay);
const getVideo = () => {
  const $gameId = selectedGames[$(event.target).val()].id;
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
//=======================Choose for me function=========================
const positionDiceAndView = (winner) => {
  console.log("winner in positionDiceAndView", winner);
  $("main").css({"transform": "scale(.6)", "transition-duration": "3s"});
  window.scrollBy(0, -600);
  $("#dice-roll-img").attr("class", "clicked-random");

  setTimeout(() => {
    $("#dice-roll-img").toggle(500);
    $("#dice-roll-img").attr("class", "");
    $("#dice-roll-img").toggle(500);
  },
  5000);
  displayWinner(winner);
  //$("#display-card"+winner).append("#dice-roll-img");
  //$("#dice-roll-img").css({"z-index": 0, "position":"static", "top":"", "right":"", "transform": "scale(1)", "transition-duration": "3s"});
  // $("#dice-roll-img").css({"z-index": 1, "position":"relative", "top":"300px", "right":"10%", "transform": "scale(2)"});
};

// const spinnerAnimation = (winner) => {
//     const $dice = $("#dice-roll-img");
//     let cardNumber = 0;
//     let $card = $("#display-card" + cardNumber);
//     let numOfMoves = 0;
//     const moveToNextCard = () => {
//         if (numOfMoves == winner + 11) {
//           clearInterval(cardMovementTimer);
//           displayWinner(winner);
//         }else{
//           if (cardNumber == selectedGames.length) {
//             cardNumber = 0;
//             $card = $("#display-card" + cardNumber).append($dice);
//           }else{
//             $card = $("#display-card"+ cardNumber).append($dice);
//             cardNumber++;
//           }
//         numOfMoves++;
//         }
//       };
//     const cardMovementTimer = setInterval(moveToNextCard, 300);
// };

const displayWinner = (winner) => {
  const $winnerModal = $("<div>").attr("id","winner-modal");
  $("body").append($winnerModal);
  const $winnerModalTextbox = $("<div>").attr("id","winner-modal-textbox");
  $winnerModalTextbox.append("<h2>And the winner is...");
  $winnerModalTextbox.append("<h1>"+selectedGames[winner].name);
  $winnerModalTextbox.append("<img src="+selectedGames[winner].images.large+">");
  $winnerModal.append($winnerModalTextbox);
  setTimeout(() => {
    $winnerModal.toggle(500);
  },5000);
};


const selectRandomGame = () => {
  const randChoice = Math.floor(Math.random() * selectedGames.length);
  console.log("choice", randChoice);
  return randChoice;
};

$(".randomizer-button").on("click", () => {
  positionDiceAndView(selectRandomGame());
  //spinnerAnimation();
});

});
