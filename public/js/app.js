$(document).ready(function () {

  // Jumbotron parallax code
  var jumboHeight = $(".jumbotron").outerHeight();

  function parallax() {
    var scrolled = $(window).scrollTop();
    $(".bg").css("height", (jumboHeight - scrolled) + "px");
  }

  $(window).scroll(function (e) {
    parallax();
  });

  // Begin client side js

  //-----------------------ARTICLES-----------------------//

  // click event to scrape new articles
  $("#scrape").on("click", function (event) {
    event.preventDefault();
    $.ajax({
      url: "/scrape/",
      type: "GET",
      success: function (response) {
        // window.location.href = "/articles/saved/";
        location.reload();
      }
    });
  });

  // click event to save an article
  $(document).on("click", ".save", function (event) {
    event.preventDefault();
    var articleId = $(this).attr("data-id");
    $.ajax({
      url: "/articles/save-article/" + articleId,
      type: "POST",
      success: function (response) {
        window.location.href = "/";
      },
      error: function (error) {
        console.log("error" + JSON.stringify(error));
      }
    });
  });

  // click event to remove an article from Saved
  $(document).on("click", ".delete-from-saved", function (event) {
    event.preventDefault();
    var articleId = $(this).attr("data-id");
    $.ajax({
      url: "/articles/delete-from-saved/" + articleId,
      type: "POST",
      // dataType: "json",
      success: function (response) {
        window.location.href = "/";
      },
      error: function (error) {
        console.log("error" + JSON.stringify(error));
      }
    });
  });

  // When the #clear-articles button is pressed
  $("#clear-articles").on("click", function (event) {
    event.preventDefault();
    // Make an AJAX GET request to delete the articles from the db
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/clear-articles",
      // On a successful call, clear the #results section
      success: function (response) {
        $("#results").empty();
        // window.location.href = "/";
        location.reload();
      }
    });
  });

  //-----------------------NOTES-----------------------//

  // Article Notes event handler - show the title of the article you are adding a note to in the modal
  $(document).on('click', '.add-note', function () {
    event.preventDefault();
    // var title = $(this).attr("data-title");
    var title = $(this).data("title");
    console.log(title);
    var id = $(this).attr("data-id");
    $("#articleTitle" + id).text(title); // this returns only the first word - have tried several variations of escaping and combinations of quotes
    //https://stackoverflow.com/questions/26848247/variable-from-attribute-only-displays-the-first-word
  });

  // When the saveNote button is clicked
  $("body").on("click", ".save-note", function (event) {
    event.preventDefault();
    // Grab the id associated with the article from the Save Note button and put it in thisId
    var thisId = $(this).attr("data-id");
    console.log("thisId: " + thisId);

    // AJAX POST call to the submit route on the server
    // This will take the data from the form and send it to the server
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/articles/save-note/" + thisId,
        data: {
          noteTitle: $(`#noteTitleInput${thisId}`).val(),
          noteBody: $(`#noteBodyInput${thisId}`).val(),
          createDate: Date.now()
        }
      })
      // If that API call succeeds, add the title and a delete button for the note to the page
      .then(function (dbArticle) {
        location.reload();
        // window.location.href = "/articles/saved/";

      });
  });

  // When user clicks the delete button for a note
  $("body").on("click", ".note-delete", function (event) {
    event.preventDefault();
    // var thisId = $(this).attr("data-id");
    var thisId = $(event.target).attr("id");
    console.log("Delete on click event - thisID: " + thisId);

    // Make an AJAX GET request to delete the specific note
    $.ajax({
      // type: "GET",
      type: "POST",
      url: "/articles/delete/" + thisId,
      // url: "/delete/" + thisId,
    }).then(
      function (data) {
        console.log("data" + data);
        location.reload();
      }
    );
  });
});