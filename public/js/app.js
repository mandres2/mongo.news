$(document).ready(function () {

  // Jumbotron code
  var jumboHeight = $(".jumbotron").outerHeight();

  function parallax() {
    var scrolled = $(window).scrollTop();
    $(".bg").css("height", (jumboHeight - scrolled) + "px");
  }

  $(window).scroll(function (e) {
    parallax();
  });

  //-----------------------ARTICLES-----------------------//

  // click event to scrape new articles
  $("#scrape").on("click", function (event) {
    event.preventDefault();
    $.ajax({
      url: "/scrape",
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
        window.location.href = "/";
        location.reload();
      }
    });
  });

  //-----------------------NOTES-----------------------//

  // Article Notes event handler - show the title of the article you are adding a note to in the modal
  $(document).on("click", ".add-note", function (event) {
    event.preventDefault();
    // var title = $(this).attr("data-title");
    var title = $(this).data("title");
    console.log(title);
    var id = $(this).attr("id");
    $("#articleTitle" + id).text(title);

    // I added this code recently so that the notes will append on the savedArticles Page.
    $.ajax({
        method: "GET",
        url: "/articles/" + id
      })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='noteTitleInput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='noteBodyInput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#noteTitleInput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#noteBodyInput").val(data.note.body);
        }

        // try show/hide method

      });

    $(".save-note").click(function () {
      $("#notes").show();
    });


  });

  // When the save Note button is clicked (class reference is: save-note)
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
        window.location.href = "/articles/saved/";
      });



    $(".save-note").click(function () {
      $("#notes").hide();
    });
  });

  // When user clicks the delete button for a note
  $("body").on("click", ".note-delete", function (event) {
    event.preventDefault();
    // var thisId = $(this).attr("data-id");
    var thisId = $(event.target).attr("id");
    console.log("Delete on click event - thisID: " + thisId);

    // Make an AJAX POST request to delete the specific note
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