//console.log($);
$(() => {
//===============Search Div=============================
let searchTerms = "";
$("form").on("submit", (event) => {
    event.preventDefault();
    searchTerms = $("input[type='text']").val();
    bgaUrlInsert = bgaSearchUrl;
    console.log(searchTerms);
    console.log(bgaSearchUrl);
    getBgaData();
  });

//================API URL Variables=============================
let bgaUrlInsert = "";
let bgaSearchUrl = "search?name="+searchTerms+"&limit=10";

//===============API Call Functions=============================
const getBgaData = () => {
  $.ajax({
        url:"https://www.boardgameatlas.com/api/"+bgaUrlInsert+"&client_id=tIPZB6stZR",
      }).then(
        (data) => {
          console.log(data);
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
