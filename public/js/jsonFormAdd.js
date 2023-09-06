const parametersToJSON = function (parameters) {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  console.log(csrfToken);

  let layout = {
    schema: {},

    value: {},
    onSubmit: function (error, values) {
      let trueData = {
        csrf_test_name: csrfToken,
        rowdata: {
          title: values.Title,
          body: values.Body,
          category_id: values.category,
        },
      };
      console.log(trueData);

      $.ajax({
        url: `/news/createNews`,
        type: "POST",
        data: trueData,
        success: function () {
          location.reload();
        },
        error: error,
      });
    },
  };

  parameters.forEach((e) => {
    layout.schema[e.title] = {};
    layout.schema[e.title]["title"] = e.data;
    layout.schema[e.title]["type"] = e.type == "readonly" ? "integer" : e.type;
    layout.schema[e.title]["required"] = e.required == true ? true : false;
    layout.schema[e.title]["readonly"] = e.type == "readonly" ? true : false;
    if (layout.schema[e.title]["type"] === "options") {
      layout.schema[e.title]["enum"] = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
    }
  });

  console.log(layout);
  $(`form`).jsonForm(layout);
};
