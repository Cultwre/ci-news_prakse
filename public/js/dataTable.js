$(document).ready(function () {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  console.log(csrfToken);

  var columnDefs = [
    {
      data: "id",
      title: "Id",
      type: "readonly",
    },
    {
      data: "title",
      title: "Title",
      type: "text",
      required: true,
    },
    {
      data: "body",
      title: "Body",
      type: "text",
      required: true,
    },
  ];
  async function createDataTable() {
    $("#example").DataTable({
      sPaginationType: "full_numbers",
      ajax: {
        url: `/news/getData`,
        // our data is an array of objects, in the root node instead of /data node, so we need 'dataSrc' parameter
        dataSrc: "",
      },
      columns: columnDefs,
      dom: "Bfrtip", // Needs button container
      select: "single",
      responsive: true,
      // altEditor: true, // Enable altEditor
      buttons: [
        {
          text: "Open Form",
          name: "Add",
          action: function () {
            document.querySelector(`form`).innerHTML = "";
            parametersToJSON(columnDefs);
          },
        },
        {
          text: "Add",
          name: "add", // do not change name
        },
        {
          extend: "selected", // Bind to Selected row
          text: "Edit",
          name: "edit", // do not change name
        },
        {
          extend: "selected", // Bind to Selected row
          text: "Delete",
          name: "delete", // do not change name
        },
      ],
      onAddRow: function (datatable, rowdata, success, error) {
        console.log(rowdata);
        let trueData = {
          csrf_test_name: csrfToken,
          rowdata: rowdata,
        };
        $.ajax({
          url: `/news/createNews`,
          type: "POST",
          data: trueData,
          success: function () {
            // location.reload();
          },
          error: error,
        });
      },
      onDeleteRow: function (datatable, rowdata, success, error) {
        let trueData = {
          csrf_test_name: csrfToken,
          rowdata: rowdata[0],
        };
        console.log(trueData);
        $.ajax({
          url: `/news/deleteNews`,
          type: "POST",
          data: trueData,
          success: function () {
            location.reload();
          },
          error: error,
        });
      },
      onEditRow: function (datatable, rowdata, success, error) {
        let trueData = {
          csrf_test_name: csrfToken,
          rowdata: rowdata,
        };
        console.log(trueData);
        $.ajax({
          url: `/news/editNews`,
          type: "POST",
          data: trueData,
          success: function () {
            location.reload();
          },
          error: error,
        });
      },
    });
  }
  createDataTable();
  // parametersToJSON(columnDefs);
});
