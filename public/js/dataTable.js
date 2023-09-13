$(document).ready(function () {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  let state = [];
  let titleObj = {};
  let categoryParsed = JSON.parse(categoryData);
  categoryParsed.forEach((e) => (titleObj[e.id] = e.news_category));

  const categoryMapping = {};
  JSON.parse(categoryData).forEach((category) => {
    categoryMapping[category.id] = category.news_category;
  });

  newsData.forEach((article) => {
    if (categoryMapping.hasOwnProperty(article.category_id)) {
      article.category_id = categoryMapping[article.category_id];
      article.subcategory_id = categoryMapping[article.subcategory_id];
    }
  });

  let jsonMeta = columnDefsPassed
    .replaceAll("meta_column_name", "data")
    .replaceAll("meta_title", "title")
    .replaceAll("meta_type", "type")
    .replaceAll(`"data":"category"`, `"data":"category_id"`)
    .replaceAll(`"data":"subcategory"`, `"data":"subcategory_id"`)
    .replaceAll("meta_required", "required");

  let columnDefs = JSON.parse(jsonMeta);

  columnDefs.forEach((e) => {
    if (e.type === "select") {
      e["options"] = titleObj;
    }
  });

  let viewColumn = JSON.parse(JSON.stringify(columnDefs));

  function editRow(target) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    categoryParsed.forEach((e) => {
      if (arr.includes(e.news_category)) {
        arr[arr.indexOf(e.news_category)] = e.id;
      }
    });

    newsData.forEach((e) => {
      if (e["id"] == arr[0]) {
        arr.push(e["json_data"]);
      }
    });

    console.log(arr);

    $("#myModal").modal("show");
    parametersToJSON(columnDefs, arr);
  }

  function viewRow(target, columnParameters) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    newsData.forEach((e) => {
      if (e["id"] == arr[0]) {
        arr.push(e["json_data"]);
      }
    });

    $("#myModal").modal("show");
    parametersToJSON(columnParameters, arr, (view = true));
  }

  // function viewRow(target) {}

  let actionButtons = {
    data: null,
    title: "Actions",
    name: "Actions",
    render: function (data, type, row, meta) {
      // return `<button id=edit-row >Edit</button> <button id=delete-row data-target="#deleteModal" data-toggle="modal">Delete</button> <button id=view-row>View</button>`;
      return `<button id="edit-row" class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fa fa-edit"></i></button>
      <button id="delete-row" data-target="#deleteModal" data-toggle="modal" class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
      <button id="view-row" class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="View"><i class="fa-solid fa-expand"></i></button>
      <input id="checkboxDelete" class="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="...">`;
    },
    // disabled: true,
  };

  columnDefs.push(actionButtons);

  // var columnDefs = [
  //   {
  //     data: "id",
  //     title: "Id",
  //     type: "readonly",
  //     required: false,
  //   },
  //   {
  //     data: "title",
  //     title: "Title",
  //     type: "text",
  //     required: true,
  //   },
  //   {
  //     data: "body",
  //     title: "Body",
  //     type: "text",
  //     required: true,
  //   },
  //   {
  //     data: "category_id",
  //     title: "category",
  //     type: "options",
  //     required: true,
  //   },
  // ];
  let columnTable = [...columnDefs];
  columnTable.splice(-2, 1);

  async function createDataTable() {
    $("#example").DataTable({
      sPaginationType: "full_numbers",
      data: newsData,
      columns: columnTable,
      dom: "Bfrtip", // Needs button container
      // select: "single",
      responsive: true,
      altEditor: false, // Enable altEditor
      buttons: [
        // {
        //   text: "Open Form",
        //   name: "Add",
        //   action: function () {
        //     document.querySelector(`form`).innerHTML = "";
        //     // parametersToJSON(columnDefs);
        //   },
        // },
        // {
        //   text: "Add",
        //   name: "Add", // do not change name
        //   action: function () {
        //     document.querySelector("form").innerHTML = "";
        //     $("#myModal").modal("show");
        //     parametersToJSON(columnDefs);
        //   },
        // },
        // {
        //   extend: "selected", // Bind to Selected row
        //   text: "Edit",
        //   name: "Edit", // do not change name
        //   action: function () {
        //     document.querySelector("form").innerHTML = "";
        //     let data = document
        //       .querySelector(".selected")
        //       .getElementsByTagName("td");
        //     let arr = [];
        //     for (let i = 0; data.length > i; i++) {
        //       arr.push(data[i].textContent);
        //     }
        //     // let columns = document.querySelector("thead").textContent;
        //     $("#myModal").modal("show");
        //     parametersToJSON(columnDefs, arr);
        //   },
        // },
        // {
        //   extend: "selected", // Bind to Selected row
        //   text: "Delete",
        //   name: "delete", // do not change name
        // },
      ],
      // onAddRow: function (datatable, rowdata, success, error) {
      //   console.log(rowdata);
      //   let trueData = {
      //     csrf_test_name: csrfToken,
      //     rowdata: rowdata,
      //   };
      //   console.log(trueData);
      //   $.ajax({
      //     url: `/news/createNews`,
      //     type: "POST",
      //     data: trueData,
      //     success: function () {
      //       location.reload();
      //     },
      //     error: error,
      //   });
      // },
      // onDeleteRow: function (datatable, rowdata, success, error) {
      //   let trueData = {
      //     csrf_test_name: csrfToken,
      //     rowdata: rowdata[0],
      //   };
      //   console.log(trueData);
      //   $.ajax({
      //     url: `/news/deleteNews`,
      //     type: "POST",
      //     data: trueData,
      //     success: function () {
      //       location.reload();
      //     },
      //     error: error,
      //   });
      // },
      // onEditRow: function (datatable, rowdata, success, error) {
      //   let trueData = {
      //     csrf_test_name: csrfToken,
      //     rowdata: rowdata,
      //   };
      //   console.log(trueData);
      //   $.ajax({
      //     url: `/news/editNews`,
      //     type: "POST",
      //     data: trueData,
      //     success: function () {
      //       // location.reload();
      //     },
      //     error: error,
      //   });
      // },
    });

    $("#addbutton").on("click", function () {
      document.querySelector("form").innerHTML = "";
      $("#myModal").modal("show");
      console.log(columnDefs);
      parametersToJSON(columnDefs);
    });

    $("#delete-button").on("click", function () {
      const checkboxes = document.querySelectorAll("#checkboxDelete");
      let checked = [];
      let array = [];

      checkboxes.forEach((e) => {
        if (e.checked) {
          let id = e.parentElement.parentElement.children[0].textContent;
          checked.push(id);
        }
      });

      newsData.forEach((e) => {
        if (checked.some((r) => e["id"].includes(r))) {
          array.push(e["json_data"]);
        }
      });

      console.log(array);

      const submitBtn = document.querySelector(`#submit-modal`);

      submitBtn.addEventListener("click", function () {
        deletingRequest(checked, array, (arr = true));
      });
    });

    $(document).on("click", "[id^='example'] #edit-row", "tr", function (x) {
      const editParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

      editRow(editParent);
    });

    $(document).on(
      "click",
      "[id^='example'] #checkboxDelete",
      "tr",
      function (x) {
        const checkbox = x.currentTarget;
        const checkboxes = document.querySelectorAll("#checkboxDelete");

        if (checkbox.checked) {
          state.push(".");
        } else {
          state.splice(-1);
        }

        if (state.length >= 2) {
          document.getElementById("delete-button").disabled = false;
        } else {
          document.getElementById("delete-button").disabled = true;
        }
      }
    );

    $(document).on("click", "[id^='example'] #delete-row", "tr", function (x) {
      const deleteParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName(
          "td"
        )[0].textContent;

      let arr = [];

      const submitBtn = document.querySelector(`#submit-modal`);

      newsData.forEach((e) => {
        if (e["id"] == deleteParent) {
          arr.push(e["json_data"]);
        }
      });

      submitBtn.addEventListener("click", function () {
        deletingRequest(deleteParent, arr);
      });
    });

    $(document).on("click", "[id^='example'] #view-row", "tr", function (x) {
      const viewParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

      viewColumn.forEach((e) => {
        e.type = "readonly";
      });

      viewRow(viewParent, viewColumn);
    });

    // $(document).on("click", "[id^='example'] #delete-row", "tr", function (x) {
    //   const deleteParent =
    //     x.currentTarget.parentElement.parentElement.getElementsByTagName(
    //       "td"
    //     )[0].textContent;

    //   const submitBtn = document.querySelector(`#submit-modal`);

    //   submitBtn.addEventListener("click", function () {
    //     deletingRequest(deleteParent);
    //   });

    //   console.log(deleteParent);
    // });
  }
  createDataTable();
  columnDefs.pop(-1);
  // parametersToJSON(columnDefs);
});
