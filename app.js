//console.log($);
$(() => {
//===============Search Div=============================

$("form").on("submit", (event) => {
    event.preventDefault();
    const searchTerms = $("input[type='text']").val();
    bgaUrlInsert = "https://www.boardgameatlas.com/api/search?name="+searchTerms+"&limit=10&client_id=tIPZB6stZR";
    //console.log(searchTerms);
    //console.log(bgaUrlInsert);
    getBgaSearchResults();
  });

//================API URL Variables=============================
let bgaUrlInsert = "";

//===============API Call Functions=============================
const getBgaSearchResults = () => {
  $.ajax({
        url: bgaUrlInsert,
      }).then(
        (data) => {
          console.log(data);
          //console.log(data.games[0]);
          for (var i = 0; i < 10; i++) {
            const resultName = data.games[i].name;
            console.log(resultName);
            const $resultDisplay = $("<div>").text(resultName);
            $(".search-section").append($resultDisplay);
          }

          // $("#title").html(data.Title);
          // $("#year").html(data.Year);
          // $("#rating").html(data.Rated);
        },
        (error) => {
          console.log(error);
        }
      );
    };

});
