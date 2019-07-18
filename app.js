//console.log($);
$(() => {
//===============Search Div=============================
let data1 = {};
$(".search-form").on("submit", (event) => {
    event.preventDefault();
    $(".results-display").empty();
    const searchTerms = $("#search-bar").val();
    bgaUrlInsert = "https://www.boardgameatlas.com/api/search?name="+searchTerms+"&limit=10&client_id=tIPZB6stZR";
    //console.log(searchTerms);
    //console.log(bgaUrlInsert);
    getBgaSearchResults();
  });

//================API URL Variables=============================
let bgaUrlInsert = "";
let resultsObj = {};
//===============API Call Functions=============================
    //=======Search Call=========
const getBgaSearchResults = () => {
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          data1 = data;
          resultsObj = data.games;
          //console.log(data.games[0]);
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
const getGameInfo = (event) => {
  numOfGames++;
  const $gameId = $(event.target).val();
  bgaUrlInsert = "https://www.boardgameatlas.com/api/search?ids="+$gameId+"&client_id=tIPZB6stZR";
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          //console.log(data);
          selectedObj = data.games[0];
          $("#title-game"+numOfGames).text(selectedObj.name);
          $("#image-game"+numOfGames).attr("src", selectedObj.thumb_url);
          $("#description-game"+numOfGames).text(selectedObj.description_preview);
//good place for string interpolation
          $("#players-game"+numOfGames).text("Min: " + selectedObj.min_players + "  Max: " + selectedObj.max_players);
          $("#playtime-game"+numOfGames).text("Min: " + selectedObj.min_playtime + "  Max: " + selectedObj.max_playtime);
          $("#rules-game"+numOfGames).attr("href" , selectedObj.rules_url);
          $("#reddit-game"+numOfGames).text(selectedObj.reddit_all_time_count + " (Since Sept. 2018)");
          console.log(selectedObj);
        },
        (error) => {
          console.log(error);
        }
      );
};

});
