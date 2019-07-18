//console.log($);
$(() => {

//================API URL Variables=============================
const bgaVariables ={
  urlInsert: "",
  searchTerms: "",
  searchURL: "search?name="+this.searchTerms+"&limit=10"
};
//===============API Call Functions=============================
const getBgaData = () => {
  $.ajax({
        url:"https://www.boardgameatlas.com/api/"+bgaVariables.searchURL+"&client_id=tIPZB6stZR",
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


//===============Search Div=============================

$("form").on("submit", (event) => {
  event.preventDefault();
  bgaVariables.searchTerms = $("input[type='text']").val();
  console.log(bgaVariables.searchTerms);
  getBgaData();
});

});
