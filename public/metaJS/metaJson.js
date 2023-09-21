// const csrfToken = document
//   .querySelector('meta[name="csrf-token"]')
//   .getAttribute("content");

const metaJSON = function (valuePassed = null, view = false, clone = false) {
  let layout = {
    schema: {
      id: {
        type: "integer",
        title: "Id",
      },
      schema_name: {
        type: "string",
        title: "Schemas name",
        required: true,
      },
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            "meta-attribute": {
              type: "string",
              title: "Meta attribute",
              required: true,
            },
            "meta-value": {
              type: "select",
              title: "Value",
              enum: ["Varchar", "Integer", "Boolean", "Longtext"],
            },
          },
        },
      },
    },
    form: [
      {
        type: "tabs",
        id: "navtabs",
        items: [
          {
            title: "Schema",
            type: "tab",
            items: [
              {
                key: "id",
                readonly: true,
              },
              {
                key: "schema_name",
                readonly: view === false ? false : true,
              },
              view === false
                ? {
                    key: "schema",
                    type: "array",
                    items: {
                      type: "section",
                      items: ["schema[]"],
                    },
                  }
                : {},
            ],
          },
        ],
      },
      view === false
        ? {
            type: "actions",
            items: [
              {
                type: "submit",
                value: "Submit",
              },
            ],
          }
        : {},
    ],
    value: {},
    onSubmit: function (error, values) {
      let ajaxData;

      if (valuePassed == null) {
        let jsonMeta = JSON.stringify(values["schema"]);

        console.log(values["schema"]);

        ajaxData = {
          csrf_test_name: csrfToken,
          rowdata: {
            schema_name: values["schema_name"],
            json_schema: jsonMeta,
          },
        };
      } else {
        let controls = document.querySelectorAll(".form-control");
        let arrayForEdit = [];
        let arrayForAjax = [];

        controls.forEach((e) => {
          arrayForEdit.push(e.value);
        });

        let jsonArray = [...arrayForEdit];
        jsonArray = jsonArray.slice(2);

        for (let i = 0; i < jsonArray.length; i += 2) {
          var obj = {
            "meta-attribute": jsonArray[i],
            "meta-value": jsonArray[i + 1],
          };

          arrayForAjax.push(obj);
        }

        console.log(arrayForAjax);
        arrayForAjax = JSON.stringify(arrayForAjax);

        ajaxData = {
          csrf_test_name: csrfToken,
          rowdata: {
            id: arrayForEdit[0],
            schema_name: arrayForEdit[1],
            json_schema: arrayForAjax,
          },
        };
      }

      console.log(ajaxData);
      console.log(clone);

      $.ajax({
        url:
          valuePassed !== null && clone === false
            ? `/form/editMeta`
            : clone === true
            ? `/form/cloneMeta`
            : `/form/createMeta`,
        type: "POST",
        data: ajaxData,
        success: function (res) {
          location.reload();
        },
        error: error,
      });
    },
  };

  if (valuePassed !== null) {
    let jsonData = JSON.parse(valuePassed[valuePassed.length - 1]);

    jsonData.forEach((e, i) => {
      let valueName = `${i}value`;
      let metaName = `${i}meta`;

      layout.schema[metaName] = {
        type: "string",
        title: "Meta attribute",
        required: true,
      };
      layout.schema[valueName] = {
        type: view === false ? "select" : "string",
        title: "Value",
        enum:
          view === false ? ["Varchar", "Integer", "Boolean", "Longtext"] : "",
      };

      layout.form[0]["items"][0]["items"].push({
        key: metaName,
        readonly: view === false ? false : true,
      });

      layout.form[0]["items"][0]["items"].push({
        key: valueName,
        readonly: view === false ? false : true,
      });

      if (view === false) {
        layout.form[0]["items"][0]["items"].push({
          type: "button",
          title: "Remove",
          onClick: function (evt) {
            const button = evt.target;

            var parentContainer = button.parentElement;

            var index = Array.from(parentContainer.children).indexOf(button);

            if (index >= 2) {
              parentContainer.removeChild(parentContainer.children[index - 1]);
              parentContainer.removeChild(parentContainer.children[index - 2]);
              button.remove();
            }
          },
        });
      }
      layout.value[metaName] = e["meta-attribute"];
      layout.value[valueName] = e["meta-value"];
    });

    layout.value["id"] = valuePassed[0];
    layout.value["schema_name"] = valuePassed[1];
    console.log(layout);
  }

  $("#meta-form").jsonForm(layout);
};

const deletingMeta = function (target) {
  console.log(target);

  let ajaxData = {
    csrf_test_name: csrfToken,
    rowdata: {
      id: target,
    },
  };

  $.ajax({
    url: `/form/deleteMeta`,
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
