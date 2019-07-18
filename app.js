//console.log($);
$(() => {
//===============Search Div=============================

$(".search-form").on("submit", (event) => {
    event.preventDefault();
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
const getBgaSearchResults = () => {
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
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

const getGameInfo = (event) => {
  console.log($(event.target).val());
  };
  // $.ajax({
  //       url: bgaUrlInsert,
  //     }).then(
  //       (data) => {
  //
  //         resultsObj = data.games;
  //         console.log(data.games[0]);
  //         for (var i = 0; i < 10; i++) {
  //           const resultName = data.games[i].name;
  //           const $resultPrintOut = $("<button id=result"+i+" value="+data.games[i].id+">"+resultName+"</button>");
  //           $(".results-options").append($resultPrintOut);
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );


});
