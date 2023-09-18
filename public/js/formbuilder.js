//   onSubmit: function (error, values) {
//     let secondForm = {
//       schema: {},
//     };

//     let metaSchema = values.schema;
//     metaSchema.forEach((e, i) => {
//       let obj = {};

//       obj[i] = {};
//       obj[i]["title"] = e["meta-attribute"];
//       obj[i]["type"] =
//         e["meta-value"] == "Varchar"
//           ? "string"
//           : e["meta-value"] == "Integer"
//           ? "integer"
//           : "boolean";

//       Object.assign(secondForm["schema"], obj);
//     });

//     console.log(secondForm);

//     valueForm.innerHTML = "";
//     $("#value-form").jsonForm(secondForm);
//     valueForm.children[0].className = "structure-form";
//     console.log(valueForm.children[0]);
//   },
// };
// $("#meta-form").jsonForm(layout);
$(document).ready(function () {
  metaData = JSON.parse(
    metaData.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
  );

  function editRow(target, view = false, clone = false) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    metaData.forEach((e) => {
      if (e["id"] == arr[0]) {
        arr.push(e["json_schema"]);
      }
    });

    console.log(arr);

    if (view === false && clone === false) {
      $("#myModal").modal("show");
      metaJSON(arr);
    } else if (view === true) {
      $("#myModal").modal("show");
      metaJSON(arr, (view = true));
    } else if (clone === true) {
      $("#myModal").modal("show");
      metaJSON(arr, (view = false), (clone = true));
    }
  }

  var columnDefs = [
    {
      data: "id",
      title: "ID",
      type: "readonly",
    },
    {
      data: "schema_name",
      title: "Schemas Name",
    },
    {
      data: "json_schema",
      title: "JSON Schema",
    },
  ];

  let actionButtons = {
    data: null,
    title: "Actions",
    name: "Actions",
    render: function (data, type, row, meta) {
      // return `<button id=edit-row >Edit</button> <button id=delete-row data-target="#deleteModal" data-toggle="modal">Delete</button> <button id=view-row>View</button>`;
      return `<button id="edit-row" class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fa fa-edit"></i></button>
      <button id="delete-row" data-target="#deleteModal" data-toggle="modal" class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
      <button id="view-row" class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="View"><i class="fa-solid fa-expand"></i></button>
      <button id="clone-row" class="btn btn-light btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Clone"><i class="fa-solid fa-clone"></i></button>
      `;
    },
    // disabled: true,
  };

  columnDefs.push(actionButtons);

  var myTable;

  let columnTable = [...columnDefs];
  columnTable.splice(-2, 1);

  myTable = $("#meta-table").DataTable({
    sPaginationType: "full_numbers",
    data: metaData,
    columns: columnTable,
    dom: "Bfrtip", // Needs button container
    responsive: true,
    altEditor: true, // Enable altEditor
    buttons: [], // no buttons, however this seems compulsory
  });

  $("#addbutton").on("click", function () {
    document.querySelector("form").innerHTML = "";
    $("#myModal").modal("show");
    metaJSON();
  });

  $(document).on("click", "[id^='meta-table'] #edit-row", "tr", function (x) {
    const editParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

    console.log(editParent);

    editRow(editParent);
  });

  $(document).on("click", "[id^='meta-table'] #delete-row", "tr", function (x) {
    const deleteParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td")[0]
        .textContent;

    console.log(deleteParent);

    const submitBtn = document.querySelector(`#submit-modal`);

    submitBtn.addEventListener("click", function () {
      deletingMeta(deleteParent);
    });
  });

  $(document).on("click", "[id^='meta-table'] #view-row", "tr", function (x) {
    const viewParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

    editRow(viewParent, (view = true));
  });

  $(document).on("click", "[id^='meta-table'] #clone-row", "tr", function (x) {
    const editParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

    console.log(editParent);

    editRow(editParent, (view = false), (clone = true));
  });
});
