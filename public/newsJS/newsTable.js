$(document).ready(function () {
  let dataForEdit = dbData;
  let state = [];

  dbData = JSON.parse(
    dbData.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
  );

  dataForEdit = JSON.parse(
    dataForEdit.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
  );

  dropdownValues = JSON.parse(dropdownValues);
  subDropdownValues = JSON.parse(subDropdownValues);

  function getCategoryValue(dropdownData) {
    if (dropdownData !== null) {
      let keyOfCategories;
      let valueOfCategories;

      for (const key in dropdownData) {
        if (Array.isArray(dropdownData[key])) {
          keyOfCategories = key;
          break;
        }
      }

      let dropdownsArr = dropdownData[keyOfCategories];

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

    console.log(dbData);
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

  function editRow(target) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    let selectedData = dataForEdit.filter((e) => e.id === arr[0]);

    $("#myModal").modal("show");
    newsJSON(selectedData);
  }

  function viewRow(target) {
    document.querySelector("form").innerHTML = "";

    let arr = [];

    for (let i = 0; target.length > i; i++) {
      arr.push(target[i].textContent);
    }

    let selectedData = dataForEdit.filter((e) => e.id === arr[0]);

    console.log(selectedData);

    $("#myModal").modal("show");
    newsJSON(selectedData, (view = true));
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

  $(document).on("click", "[id^='news-table'] #edit-row", "tr", function (x) {
    const editParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

    editRow(editParent);
  });

  $(document).on("click", "[id^='news-table'] #view-row", "tr", function (x) {
    const viewParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td");

    viewRow(viewParent);
  });

  $(document).on("click", "[id^='news-table'] #delete-row", "tr", function (x) {
    const deleteParent =
      x.currentTarget.parentElement.parentElement.getElementsByTagName("td")[0]
        .textContent;

    const submitBtn = document.querySelector(`#submit-modal`);
    console.log(deleteParent);

    submitBtn.addEventListener("click", function () {
      deletingRecord(deleteParent);
    });
  });

  $(document).on(
    "click",
    "[id^='news-table'] #checkboxDelete",
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

    console.log(checked);

    const submitBtn = document.querySelector(`#submit-modal`);

    submitBtn.addEventListener("click", function () {
      deletingRecord(checked, (multiple = true));
    });
  });
});
