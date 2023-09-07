const parametersToJSON = function (parameters) {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  let categoryParsed = JSON.parse(categoryData);
  let enumArr = [];
  let titleObj = {};

  categoryParsed.forEach((e) => enumArr.push(e.id));

  categoryParsed.forEach((e) => (titleObj[e.id] = e.news_category));

  // console.log(titleObj);

  let layout = {
    schema: {},

    form: [],
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
    layout.schema[e.title]["required"] = e.required == "true" ? true : false;
    layout.schema[e.title]["readonly"] = e.type == "readonly" ? true : false;

    if (layout.schema[e.title]["type"] === "select") {
      layout.schema[e.title]["enum"] = enumArr;

      let obj = {
        key: e.title,
        titleMap: titleObj,
      };

      layout.form.push(obj);
    } else {
      let obj = {
        key: e.title,
      };

      layout.form.push(obj);
    }
  });

  layout.form.push({
    type: "submit",
    title: "Submit",
  });

  // console.log(layout);
  $(`form`).jsonForm(layout);
};
