$(document).ready(function() {
  //initialise the table; hide the ID column; Disable searching on Actions Column;
  //REMEMBER! if columns are hidden then shift "thisPosition" variables in this code.
  var table = $('#example').DataTable({
    "columns": [{
        "visible": false,
        "searchable": false,
      },
      null,
      null,
      null,
      null,
      {
        "visible": true,
        "searchable": false,
      },
    ]
  });

  //set up variables for any colums that will need drop-down inputs
  var luSuffix = [
    "",
    "II",
    "III",
  ];

  //on-click listener for suffix column
  $('#example tbody').on('click', '.suffix', function() {
    var row = this.parentElement;
    if (!$('#example').hasClass("editing")) {
      $('#example').addClass("editing");
      var data = table.row(row).data();
      var $row = $(row);
      var thisSuffix = $row.find("td:nth-child(4)"); //count each visible column starting at 1.  
      var thisSuffixText = thisSuffix.text();
      thisSuffix.empty().append($("<select></select>", {
        "id": "Suffix_" + data[0],
        "class": "changeSuffix" //the column 'Suffix' which is the 4th column which equals the 3rd index (i.e., child(3))
      }).append(function() {
        var options = [];
        $.each(luSuffix, function(k, v) {
          options.push($("<option></option>", {
            "text": v,
            "value": v
          }))
        })
        return options;
      }));
      $("#Suffix_" + data[0]).val(thisSuffixText)
    }
  });

  //on-click listener for last name column
  $('#example tbody').on('click', '.lastName', function() {
    var row = this.parentElement; //the <tr></tr>
    if (!$('#example').hasClass("editing")) {
      $('#example').addClass("editing");
      var data = table.row(row).data();
      var $row = $(row);
      var thisLastName = $row.find("td:nth-child(3)"); //count each visible column starting at 1.  
      var thisLastNameText = thisLastName.text();
      thisLastName.empty().append($("<input>", {
        "id": "lastName_" + data[0],
        "class": "changeLastName" //the column 'Last Name'
      }));
      $("#lastName_" + data[0]).val(thisLastNameText);
      $("#lastName_" + data[0]).focus(); //set focus
    }
  });

    //on-click listener for input class
/*     $('#example tbody').on('click', '.input', function() {
      console.log("I've been clicked!");
    });

    $('#example tbody').on("focus", ".input", function() {
        console.log("focus");
    }); */

    $('#example tbody').on("blur", ".changeLastName", function() {
      var $this = $(this);
      var $thisCell = table.cell($this.parents('td'));
      var tempData = table.row($this.closest("tr")).data().slice();
      tempData[3] = $this.val();  //count visible (or all?) columns starting with zero because this is an array
      table.row($this.closest("tr")).data(tempData);
      $thisCell.data($this.val()).draw();
  
      $('#example').removeClass("editing");
    });

  $('#example tbody').on("change", ".changeSuffix", function() {
    var $this = $(this);
    var $thisCell = table.cell($this.parents('td'));
    var tempData = table.row($this.closest("tr")).data().slice();
    tempData[4] = $this.val();  //count visible (or all?) columns starting with zero because this is an array

    //Insert "save" capability into final column
    tempData[5] = '<button id="btn_'+tempData[0]+'"type="button" class="btn btn-sm btn-outline-secondary save">Save</button>'
    //count all columns starting with zero because this is an array
    //Overwrite the old data in the table's row with the new data which is in the array tempData
    table.row($this.closest("tr")).data(tempData);
    $thisCell.data($this.val()).draw();

    $('#example').removeClass("editing");
  });

  $('#example tbody').on("change", ".changeLastName", function() {
    var $this = $(this);
    var $thisCell = table.cell($this.parents('td'));
    var tempData = table.row($this.closest("tr")).data().slice();
    tempData[3] = $this.val();  //count visible (or all?) columns starting with zero because this is an array

    //Insert "save" capability into final column
    tempData[5] = '<button id="btn_'+tempData[0]+'"type="button" class="btn btn-sm btn-outline-secondary save">Save</button>'
    //count all columns starting with zero because this is an array
    //Overwrite the old data in the table's row with the new data which is in the array tempData
    table.row($this.closest("tr")).data(tempData);
    $thisCell.data($this.val()).draw();

    $('#example').removeClass("editing");
  });

  $('#example tbody').on('click', '.save', function() {
    var id = $(this).attr('id');
    var $this = $(this);
    var saveData = table.row($this.closest("tr")).data();

    //remove last element of array (because it's the save button html);
    saveData.pop();

    //call ajax post function
    postDataFunction(saveData, id);
  });

  function postDataFunction(dataStr, intIn) {

    //set file name
    var queryURL = "incl\\ajax\\employeesSave_ajax.php";

    //disable the inputs for the duration of the Ajax request
    /*put some code here*/

    //fire off the ajax request
    request = $.ajax({
      url: queryURL,
      method: "POST",  //note:  use type instead of method for versions of jquery prior to 1.9.0
      data: {dataToSave:dataStr},
      //dataType: JSON, //(default: Intelligent Guess (xml, json, script, or html)
    });

    //Callback handler that will be called on success
    request.done(function (reply){
      // Log a message to the console
      console.log("Hooray, it worked!");
      console.log(reply);
      //remove save button
      $("#"+intIn).remove();
    });

    //Callback handler that will be called on failure
    request.fail(function (reply){
      // Log the error to the console
      //console.error("The following error occurred: "+textStatus+", "+errorThrown);
      console.log("Oh No!  It Failed!");
      console.log(reply);
    });

    //callback handler that will be called regardless if the request failed or succeeded
    request.always(function () {
      console.log("Always run this!");
      // Reenable the inputs
      //$inputs.prop("disabled", false);
    });    

  };//end myAjaxFunction
  


}); //end document ready