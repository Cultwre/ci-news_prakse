$(document).ready(function () {
  dbData = JSON.parse(
    dbData.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
  );
  dropdownValues = JSON.parse(dropdownValues);
  subDropdownValues = JSON.parse(subDropdownValues);

  function getCategoryValue(dropdownValues) {
    if (dropdownValues !== null) {
      let keyOfCategories;
      let valueOfCategories;

      for (const key in dropdownValues) {
        if (Array.isArray(dropdownValues[key])) {
          keyOfCategories = key;
          break;
        }
      }

      let dropdownsArr = dropdownValues[keyOfCategories];

      for (const key in dropdownsArr[0]) {
        if (dropdownsArr[0].hasOwnProperty(key)) {
          valueOfCategories = key;
        }
      }

      dbData.forEach((article) => {
        if (dropdownsArr[0].hasOwnProperty(valueOfCategories)) {
          dropdownsArr.forEach((e) => {
            if (e.id == article[keyOfCategories]) {
              article[keyOfCategories] = e[valueOfCategories];
            }
          });
        }
      });
    }
  }

  if (Array.isArray(dropdownValues)) {
    dropdownValues.forEach((e) => {
      getCategoryValue(e);
    });
  } else {
    getCategoryValue(dropdownValues);
  }

  if (Array.isArray(subDropdownValues)) {
    subDropdownValues.forEach((e) => {
      getCategoryValue(e);
    });
  } else {
    getCategoryValue(subDropdownValues);
  }

  var columnDefs = [];

  metaAttributes.forEach((e) => {
    if (e.table_name === userInput && e.show_in_list === "1") {
      let data = JSON.parse(e.attributes_json);

      let titleOfColumn = data.find((e) => e.title);

      let obj;

      obj = {
        data: e.column_name,
        title: titleOfColumn.title,
      };

      columnDefs.push(obj);
    }
  });

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

  myTable = $("#news-table").DataTable({
    sPaginationType: "full_numbers",
    data: dbData,
    columns: columnDefs,
    dom: "Bfrtip", // Needs button container
    responsive: true,
    altEditor: true, // Enable altEditor
    buttons: [], // no buttons, however this seems compulsory
  });

  $("#addbutton").on("click", function () {
    document.querySelector("form").innerHTML = "";
    $("#myModal").modal("show");
    newsJSON();
  });
});
