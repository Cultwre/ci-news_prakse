const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const parametersToJSON = function (
  parameters,
  valuePassed = null,
  view = false
) {
  let categoryParsed = JSON.parse(categoryData);
  let enumArr = [];
  let titleObj = {};

  categoryParsed.forEach((e) => enumArr.push(e.id));

  categoryParsed.forEach((e) => (titleObj[e.id] = e.news_category));

  let layout = {
    schema: {},

    form: [],

    value: {},
    onSubmit: function (error, values) {
      let dataForAJAX;

      if (valuePassed !== null) {
        dataForAJAX = {
          id: values.Id,
          title: values.Title,
          body: values.Body,
          category_id: values.category,
        };
      } else {
        dataForAJAX = {
          title: values.Title,
          body: values.Body,
          category_id: values.category,
        };
      }

      let trueData = {
        csrf_test_name: csrfToken,
        rowdata: dataForAJAX,
        // rowdata: {
        //   title: values.Title,
        //   body: values.Body,
        //   category_id: values.category,
        // },
      };

      $.ajax({
        // url: ``,
        url:
          valuePassed !== null
            ? `/news/editNews`
            : view == true
            ? ``
            : `/news/createNews`,
        type: "POST",
        data: trueData,
        success: function () {
          location.reload();
        },
        error: error,
      });
    },
  };

  parameters.forEach((e, i) => {
    layout.schema[e.title] = {};
    layout.schema[e.title]["title"] = e.data;
    layout.schema[e.title]["type"] = e.type == "readonly" ? "text" : e.type;
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

    if (valuePassed !== null) {
      layout.value[e.title] = valuePassed[i];
      console.log(valuePassed[i]);
    }
  });

  if (view !== true) {
    layout.form.push({
      type: "submit",
      title: "Submit",
    });
  }

  // console.log(layout);
  $(`form`).jsonForm(layout);
};

const deletingRequest = function (dataForAJAX, arr = false, error) {
  let trueData = {
    csrf_test_name: csrfToken,
    rowdata: { id: dataForAJAX },
  };

  $.ajax({
    url: arr == false ? `/news/deleteNews` : `/news/deleteMultipleNews`,
    type: "POST",
    data: trueData,
    success: function () {
      location.reload();
    },
    error: error,
  });
};
