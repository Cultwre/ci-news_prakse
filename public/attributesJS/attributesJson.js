metaValue = JSON.parse(
  metaValue.replaceAll(`"[{"`, `[{"`).replaceAll(`"}]"`, `"}]`)
);

const attributesJSON = function (
  valuePassed = null,
  view = false,
  clone = false
) {
  console.log(metaValue);

  let layout = {
    schema: {
      id: {
        type: "integer",
        title: "Id",
      },
      table_name: {
        title: "Table's name",
        type: "string",
      },
      column_name: {
        title: "Column's name",
        type: "string",
      },
      show_in_list: {
        title: "Show in table?",
        type: "integer",
        enum: [0, 1],
      },
      form_part: {
        title: "Form part",
        type: "string",
        enum: ["Schema", "Form", "Reference"],
      },
      schema_id: {
        title: "Schema",
        type: "string",
        enum: [0],
      },
    },
    form: [
      {
        key: "id",
        readonly: true,
      },
      {
        key: "table_name",
        readonly: view !== true ? false : true,
      },
      {
        key: "column_name",
        readonly: view !== true ? false : true,
      },
      {
        key: "show_in_list",
        readonly: view !== true ? false : true,
      },
      {
        key: "form_part",
        readonly: view !== true ? false : true,
      },
      {
        key: "schema_id",
        titleMap: [""],
        readonly: view !== true ? false : true,
        onChange: function (evt) {
          showDropdownContent(evt.target.value);
        },
      },
    ],
    value: {},
  };

  let titleMapObj;
  layout.form.forEach((e) => {
    if (e.key === "schema_id") {
      titleMapObj = e;
    }
  });

  metaValue.forEach((e) => {
    layout.schema.schema_id.enum.push(e.id);
    titleMapObj.titleMap.push(e.schema_name);
  });

  if (valuePassed !== null) {
    console.log(valuePassed);
    layout.value["id"] = valuePassed[0];
    layout.value["table_name"] = valuePassed[1];
    layout.value["column_name"] = valuePassed[2];
    layout.value["show_in_list"] = valuePassed[3];
    layout.value["form_part"] = valuePassed[4];
    layout.value["schema_id"] = valuePassed[5];
  }

  $("#attributes-form").jsonForm(layout);

  const showDropdownContent = function (targetId) {
    let schema;

    metaValue.forEach((e) => {
      if (e.id === targetId) {
        schema = e.json_schema;
      }
    });
    console.log(schema);

    document.querySelector(`#schema-form`).innerHTML = "";

    let secondForm = {
      schema: {},
      form: [],
      value: {},
    };

    if (schema !== undefined) {
      schema.forEach((e, i) => {
        let obj = {};

        obj[i] = {};
        obj[i]["title"] = e["meta-attribute"];
        obj[i]["type"] =
          e["meta-value"] == "Varchar"
            ? "string"
            : e["meta-value"] == "Integer"
            ? "integer"
            : e["meta-value"] == "Boolean"
            ? "boolean"
            : "string";
        obj[i]["required"] = true;
        obj[i]["readonly"] = view !== true ? false : true;

        Object.assign(secondForm["schema"], obj);

        if (e["meta-value"] == "Boolean" && view === true) {
          secondForm["form"].push({
            key: `${i}`,
            disabled: true,
          });
        } else {
          secondForm["form"].push({ key: `${i}` });
        }

        if (valuePassed !== null) {
          let passedDropdownValue = valuePassed[valuePassed.length - 1];
          console.log(passedDropdownValue[0]);

          console.log(e["meta-attribute"]);

          if (passedDropdownValue[0][e["meta-attribute"]] == "false") {
            secondForm.value[i] = false;
          } else {
            secondForm.value[i] = passedDropdownValue[0][e["meta-attribute"]];
          }
        }
      });

      if (view !== true) {
        secondForm["form"].push({
          type: "actions",
          items: [
            {
              type: "submit",
              value: "Submit",
            },
          ],
        });
      }

      secondForm["onSubmit"] = function (error, values) {
        let ajaxData;
        let controls = document
          .querySelector("#attributes-form")
          .querySelectorAll(".form-control");
        let arrayForSubmit = [];
        let arrayForLabels = [];
        let arrayForAjax = [];

        controls.forEach((e) => {
          arrayForSubmit.push(e.value);
        });

        console.log(arrayForSubmit);

        document
          .querySelector("#schema-form")
          .querySelectorAll("label")
          .forEach((e) => {
            console.log(e.textContent);
            if (e.textContent !== "") {
              arrayForLabels.push(e.textContent);
            }
          });

        console.log(arrayForLabels);

        let obj = {};

        arrayForLabels.forEach((event, i) => {
          obj[event] = String(values[i]);
        });

        arrayForAjax.push(obj);

        console.log(arrayForAjax);
        console.log(arrayForSubmit);

        if (valuePassed == null) {
          ajaxData = {
            csrf_test_name: csrfToken,
            rowdata: {
              table_name: arrayForSubmit[1],
              column_name: arrayForSubmit[2],
              show_in_list: +arrayForSubmit[3],
              form_part: arrayForSubmit[4],
              schema_id: arrayForSubmit[5],
              attributes_json: JSON.stringify(arrayForAjax),
            },
          };
        } else if (valuePassed !== null) {
          ajaxData = {
            csrf_test_name: csrfToken,
            rowdata: {
              id: arrayForSubmit[0],
              table_name: arrayForSubmit[1],
              column_name: arrayForSubmit[2],
              show_in_list: +arrayForSubmit[3],
              form_part: arrayForSubmit[4],
              schema_id: arrayForSubmit[5],
              attributes_json: JSON.stringify(arrayForAjax),
            },
          };
        }

        console.log(ajaxData);

        $.ajax({
          url:
            valuePassed !== null && clone === false
              ? `/attributes/editColumn`
              : clone === true
              ? `/attributes/cloneColumn`
              : `/attributes/createColumn`,
          type: "POST",
          data: ajaxData,
          success: function (res) {
            location.reload();
          },
          error: error,
        });
      };

      console.log(secondForm);

      $("#schema-form").jsonForm(secondForm);

      // if (view === true) {
      //   let htmlElements = document.querySelector("#schema-form").elements;

      //   htmlElements[htmlElements.length - 1].remove();

      //   console.log(htmlElements);
      // }
    }
  };

  const dropdown = document.getElementsByName("schema_id")[0];
  const showInList = document.getElementsByName("show_in_list")[0];
  const formPart = document.getElementsByName("form_part")[0];

  dropdown.onload = showDropdownContent(dropdown.value);

  if (view === true) {
    dropdown.setAttribute("readonly", "true");
    showInList.setAttribute("readonly", "true");
    formPart.setAttribute("readonly", "true");
  }
};

const deletingAttribute = function (target) {
  console.log(target);

  let ajaxData = {
    csrf_test_name: csrfToken,
    rowdata: {
      id: target,
    },
  };

  $.ajax({
    url: `/attributes/deleteColumn`,
    type: "POST",
    data: ajaxData,
    success: function (res) {
      location.reload();
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
};
