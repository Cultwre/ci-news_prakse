$(document).ready(function () {
  attributesData = JSON.parse(
    attributesData.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
  );

  console.log(attributesData);

  function editRow(target, view = false, clone = false) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    attributesData.forEach((e) => {
      if (e["id"] == arr[0]) {
        arr.push(e["attributes_json"]);
      }
    });

    if (view === false && clone === false) {
      $("#myModal").modal("show");
      attributesJSON(arr);
    } else if (view === true) {
      $("#myModal").modal("show");
      attributesJSON(arr, (view = true));
    } else if (clone === true) {
      $("#myModal").modal("show");
      attributesJSON(arr, (view = false), (clone = true));
    }
  }

  var columnDefs = [
    {
      data: "id",
      title: "ID",
      type: "readonly",
    },
    {
      data: "table_name",
      title: "Table's name",
    },
    {
      data: "column_name",
      title: "Column's name",
    },
    {
      data: "show_in_list",
      title: "Show in table?",
    },
    {
      data: "form_part",
      title: "Form part",
    },
    {
      data: "schema_id",
      title: "Schema",
    },
  ];

  let actionButtons = {
    data: null,
    title: "Actions",
    name: "Actions",
    render: function (data, type, row, meta) {
      // return `<button id=edit-row >Edit</button> <button id=delete-row data-target="#deleteModal" data-toggle="modal">Delete</button> <button id=view-row>View</button>`;
      return `<button id="edit-row" class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fa fa-edit"></i></button>
      <button id="delete-row" data-target="#deleteRow" data-toggle="modal" class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
      <button id="view-row" class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="View"><i class="fa-solid fa-expand"></i></button>
      <button id="clone-row" class="btn btn-light btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Clone"><i class="fa-solid fa-clone"></i></button>
      `;
    },
    // disabled: true,
  };

  columnDefs.push(actionButtons);

  var myTable;

  myTable = $("#attributes-table").DataTable({
    sPaginationType: "full_numbers",
    data: attributesData,
    columns: columnDefs,
    dom: "Bfrtip", // Needs button container
    responsive: true,
    altEditor: true, // Enable altEditor
    buttons: [], // no buttons, however this seems compulsory
  });

  $("#addbutton").on("click", function () {
    document.querySelector("#attributes-form").innerHTML = "";
    document.querySelector("#schema-form").innerHTML = "";
    $("#myModal").modal("show");
    attributesJSON();
  });

  $(document).on(
    "click",
    "[id^='attributes-table'] #edit-row",
    "tr",
    function (x) {
      const editParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

      console.log(editParent);

      editRow(editParent);
    }
  );

  $(document).on(
    "click",
    "[id^='attributes-table'] #delete-row",
    "tr",
    function (x) {
      const deleteParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName(
          "td"
        )[0].textContent;

      console.log(deleteParent);

      const submitBtn = document.querySelector(`#submit-modal`);

      submitBtn.addEventListener("click", function () {
        deletingAttribute(deleteParent);
      });
    }
  );

  $(document).on(
    "click",
    "[id^='attributes-table'] #view-row",
    "tr",
    function (x) {
      const viewParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

      editRow(viewParent, (view = true));
    }
  );

  $(document).on(
    "click",
    "[id^='attributes-table'] #clone-row",
    "tr",
    function (x) {
      const editParent =
        x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

      console.log(editParent);

      editRow(editParent, (view = false), (clone = true));
    }
  );
});
