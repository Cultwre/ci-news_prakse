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
    layout.schema[e.title]["required"] = e.required ? true : false;
    layout.schema[e.title]["readonly"] = e.type == "readonly" ? true : false;
  });

  console.log(layout);
  $(`form`).jsonForm(layout);
};
