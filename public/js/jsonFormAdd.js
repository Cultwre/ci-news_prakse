const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");
let filesArr = [];

const parametersToJSON = function (
  parameters,
  valuePassed = null,
  view = false
) {
  let categoryParsed = JSON.parse(categoryData);
  let enumArr = [];
  let subEnumArr = [];
  let titleObj = {};
  let subTitleObj = {};
  let newFiles = [];
  let filesPassed = valuePassed !== null ? valuePassed.slice(-1)[0] : null;

  categoryParsed.forEach((e) => {
    if (e.parent_id == null) {
      enumArr.push(e.id);
    } else {
      subEnumArr.push(e.id);
    }
  });

  categoryParsed.forEach((e) => {
    titleObj[e.id] = e.news_category;

    if (e.parent_id == null) {
      titleObj[e.id] = e.news_category;
    } else {
      subTitleObj[e.id] = e.news_category;
    }
  });

  console.log(
    document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
    })
  );

  let layout = {
    schema: {},

    form: [],

    value: {},
    onSubmit: function (error, values) {
      let dataForAJAX;
      let nameArr = [];

      console.log($(this));

      filesArr.forEach((e) => {
        nameArr.push(e.name);
      });

      let obj = {
        imgs: nameArr,
      };

      let jsonObj = JSON.stringify(obj);

      console.log(nameArr);

      if (valuePassed !== null) {
        dataForAJAX = {
          id: values.Id,
          title: values.Title,
          body: values.Body,
          category_id: values.category,
          subcategory_id: values.subcategory,
        };
      } else {
        dataForAJAX = {
          title: values.Title,
          body: values.Body,
          category_id: values.category,
          subcategory_id: values.subcategory,
        };
      }

      const selectedFiles = document.querySelectorAll(
        'input[name="selectedFiles"]:checked'
      );
      const allCheckboxes = document.querySelectorAll(
        'input[name="selectedFiles"]'
      );

      console.log(selectedFiles.length !== 0);
      let arrayOfOldFiles = [];
      let arrayOfFiles = [];
      let arrayOfnonSelectedFiles = [];

      if (selectedFiles.length !== 0) {
        console.log(`check`);
        const selectedUrls = Array.from(selectedFiles).map(
          (file) => file.value
        );

        JSON.parse(filesPassed).forEach((e) => {
          if (selectedUrls.some((r) => e["file_url"].includes(r))) {
            arrayOfOldFiles.push(e);
          }
        });

        dataForAJAX["old_files"] = arrayOfOldFiles;
      }

      allCheckboxes.forEach((e) => {
        if (e.checked == false) {
          arrayOfnonSelectedFiles.push(e);
        }
      });

      if (arrayOfnonSelectedFiles.length !== 0) {
        console.log(`check1`);
        const nonSelectedUrls = Array.from(arrayOfnonSelectedFiles).map(
          (file) => file.value
        );

        JSON.parse(filesPassed).forEach((e) => {
          if (nonSelectedUrls.some((r) => e["file_url"].includes(r))) {
            arrayOfFiles.push(e);
          }
        });

        dataForAJAX["saved_files"] = arrayOfFiles;
      }

      console.log(arrayOfnonSelectedFiles);

      var formData = new FormData();
      formData.append("csrf_test_name", csrfToken);
      formData.append("rowdata", JSON.stringify(dataForAJAX));

      for (var i = 0; i < filesArr.length; i++) {
        formData.append("files[]", filesArr[i]);
      }

      let trueData = {
        csrf_test_name: csrfToken,
        rowdata: dataForAJAX,
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
        data: formData,
        processData: false,
        contentType: false,

        success: function (res) {
          location.reload();
        },
        error: error,
      });
    },
  };

  function jsonForm() {
    parameters.forEach((e, i) => {
      layout.schema[e.title] = {};
      layout.schema[e.title]["title"] = e.data;
      layout.schema[e.title]["type"] = e.type == "readonly" ? "text" : e.type;
      layout.schema[e.title]["required"] = e.required == "true" ? true : false;
      layout.schema[e.title]["readonly"] = e.type == "readonly" ? true : false;

      if (
        layout.schema[e.title]["type"] === "select" &&
        e.title == "category"
      ) {
        layout.schema[e.title]["enum"] = enumArr;

        let obj = {
          key: e.title,
          titleMap: titleObj,
          onInsert: function (evt) {
            const subDropdown = document.getElementsByName("subcategory")[0];
            const value = document.getElementsByName("category")[0].value;
            let = categoryArr = [];

            categoryParsed.forEach((e) => {
              if (e.parent_id == value) {
                let newOption = new Option(e.news_category, e.id);
                subDropdown.add(newOption, undefined);
              }
            });

            categoryParsed.forEach((e) => {
              if (e.parent_id == null) {
                categoryArr.push(e);
              }
            });

            if (valuePassed !== null) {
              subDropdown.value = valuePassed[4];
              // valuePassed.find((e) => {
              //   e > categoryArr.length;
              // });
            }

            const filesInput = document.getElementsByName("files")[0];
            filesInput.setAttribute("multiple", "multiple");

            var element = document.createElement("div");
            element.className = "filePreview";
            filesInput.parentElement.appendChild(element);
            console.log(element);

            // const hrElement = document.createElement("hr");
            // filesInput.parentElement.appendChild(hrElement);
            // var elementOld = document.createElement("div");
            // elementOld.className = "filePreviewOld";
            // filesInput.parentElement.appendChild(elementOld);
            // console.log(elementOld);

            // if (valuePassed !== null) {
            //   let files = JSON.parse(filesPassed);

            //   const filesInput = document.getElementsByName("files")[0];
            //   const filePreviews =
            //     document.getElementsByClassName("filePreviewOld")[0];

            //   console.log(filesInput);
            //   console.log(filePreviews);
            //   filePreviews.innerHTML = "";

            //   files.forEach((e) => {
            //     const previewElement = document.createElement("div");

            //     const checkbox = document.createElement("input");
            //     checkbox.type = "checkbox";
            //     checkbox.name = "selectedFiles"; // Set a name to identify selected files
            //     checkbox.value = e["file_url"];
            //     checkbox.className = "checkbox"; // Set the value to the file URL
            //     previewElement.appendChild(checkbox);

            //     let url = e["file_url"];
            //     var fileExtension = url.split(".").pop().toLowerCase();
            //     console.log(fileExtension);
            //     if (fileExtension.match(/(gif|png|jpg|jpeg)$/)) {
            //       const thumbnail = document.createElement("img");
            //       thumbnail.classList.add("image-thumbnail");
            //       thumbnail.style.width = "auto";
            //       thumbnail.style.height = "100px";
            //       thumbnail.src = url;
            //       previewElement.appendChild(thumbnail);
            //     } else {
            //       const icon = document.createElement("i");
            //       icon.classList.add("fa-regular", "fa-file-lines");
            //       previewElement.appendChild(icon);
            //     }
            //     const fileNameElement = document.createElement("div");
            //     fileNameElement.className = "fileName";
            //     fileNameElement.textContent = e["file_clientName"];
            //     previewElement.appendChild(fileNameElement);

            //     filePreviews.appendChild(previewElement);
            //   });
            // }
          },
          onChange: function (evt) {
            const subDropdown = document.getElementsByName("subcategory")[0];

            var value = $(evt.target).val();

            while (subDropdown.options.length > 0) {
              subDropdown.remove(0);
            }

            categoryParsed.forEach((e) => {
              if (e.parent_id == value) {
                let newOption = new Option(e.news_category, e.id);
                subDropdown.add(newOption, undefined);
              }
            });
          },
        };

        layout.form.push(obj);
      } else if (
        layout.schema[e.title]["type"] === "select" &&
        e.title == "subcategory"
      ) {
        // layout.schema[e.title]["enum"] = subEnumArr;

        let obj = {
          key: e.title,
          titleMap: subTitleObj,
        };

        layout.form.push(obj);
      } else if (e.title !== "files") {
        let obj = {
          key: e.title,
        };
        layout.form.push(obj);
      } else if (e["meta_json_type"] == "file") {
        let obj = {
          key: e.title,
          type: "file",
          accept: ".txt,.md,.png,.jpg,.jpeg,.gif,.pdf",
          notitle: true,
          multiple: true,
          onInsert: function (evt) {},
          onChange: function (evt) {},
        };

        layout.form.push(obj);
      }

      if (valuePassed !== null) {
        layout.value[e.title] = valuePassed[i];
      }
    });
  }
  jsonForm();

  if (view !== true) {
    layout.form.push({
      type: "submit",
      title: "Submit",
    });
  }

  console.log(layout);

  $(`form`).jsonForm(layout);

  const filesInput = document.getElementsByName("files")[0];

  if (view == true || valuePassed !== null) {
    const filesInput = document.getElementsByName("files")[0];
    filesInput.setAttribute("multiple", "multiple");

    if (view == false) {
      var element = document.createElement("div");
      element.className = "filePreview";
      filesInput.parentElement.appendChild(element);
      console.log(element);

      const hrElement = document.createElement("hr");
      filesInput.parentElement.appendChild(hrElement);
    }

    var elementOld = document.createElement("div");
    elementOld.className = "filePreviewOld";
    filesInput.parentElement.appendChild(elementOld);
    console.log(elementOld);

    if (view == true) {
      filesInput.remove();
    }

    if (valuePassed !== null) {
      let files = JSON.parse(filesPassed);

      const filesInput = document.getElementsByName("files")[0];
      const filePreviews = document.getElementsByClassName("filePreviewOld")[0];

      console.log(filesInput);
      console.log(filePreviews);
      filePreviews.innerHTML = "";

      files.forEach((e) => {
        const previewElement = document.createElement("div");

        if (view == false) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "selectedFiles"; // Set a name to identify selected files
          checkbox.value = e["file_url"];
          checkbox.className = "checkbox"; // Set the value to the file URL
          previewElement.appendChild(checkbox);
        }

        let url = e["file_url"];
        var fileExtension = url.split(".").pop().toLowerCase();
        console.log(fileExtension);
        if (fileExtension.match(/(gif|png|jpg|jpeg)$/)) {
          const thumbnail = document.createElement("img");
          thumbnail.classList.add("image-thumbnail");
          thumbnail.style.width = "auto";
          thumbnail.style.height = "100px";
          thumbnail.src = url;
          previewElement.appendChild(thumbnail);
        } else {
          const icon = document.createElement("i");
          icon.classList.add("fa-regular", "fa-file-lines");
          previewElement.appendChild(icon);
        }
        const fileNameElement = document.createElement("div");
        fileNameElement.className = "fileName";
        fileNameElement.textContent = e["file_clientName"];
        previewElement.appendChild(fileNameElement);

        filePreviews.appendChild(previewElement);
      });
    }
  }

  filesInput.addEventListener("change", function (e) {
    // var element = document.createElement("div");
    // element.className = "filePreview";

    // filesInput.parentElement.appendChild(element);
    // console.log(element);

    // const filesInput = document.getElementsByName("files")[0];
    const filePreviews = document.getElementsByClassName("filePreview")[0];

    console.log("qwe");

    filePreviews.innerHTML = "";

    filePreviews.innerHTML = `<button class="removeAll" >Remove all</button>`;

    for (const file of filesInput.files) {
      const previewElement = document.createElement("div");

      if (file.type.startsWith("image/")) {
        // For image files, display a thumbnail
        const thumbnail = document.createElement("img");
        thumbnail.classList.add("image-thumbnail");

        thumbnail.style.width = "auto";
        thumbnail.style.height = "100px";

        thumbnail.src = URL.createObjectURL(file);
        previewElement.appendChild(thumbnail);
      } else {
        const icon = document.createElement("i");

        icon.classList.add("fa-regular", "fa-file-lines");

        previewElement.appendChild(icon);
      }

      const fileNameElement = document.createElement("div");
      fileNameElement.className = "fileName";

      fileNameElement.textContent = file.name;

      previewElement.appendChild(fileNameElement);

      let inputList = filesInput.files;
      console.log(inputList);

      for (let i = 0; inputList.length > i; i++) {
        if (!newFiles.includes(inputList[i])) {
          newFiles.push(inputList[i]);
        }
      }
      newFiles = Array.from(filesInput.files);

      filesArr = newFiles;
      console.log(newFiles);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", (e) => {
        e.preventDefault();

        let idx = newFiles.indexOf(file);

        newFiles.splice(idx, 1);

        console.log(newFiles);

        filesArr = newFiles;

        console.log(filesArr);

        previewElement.remove();
      });

      const remAllBtn = document.querySelector(`.removeAll`);
      remAllBtn.addEventListener("click", function (e) {
        e.preventDefault();

        filesInput.value = ``;
        filePreviews.innerHTML = ``;
        console.log(newFiles);

        filesArr = newFiles;
        console.log(filesArr);
      });

      previewElement.appendChild(removeButton);

      filePreviews.appendChild(previewElement);
    }
  });
};

const deletingRequest = function (dataForAJAX, data, arr = false, error) {
  let trueData;

  if (arr !== true) {
    let files = JSON.parse(data);
    let fileNameArr = [];

    files.forEach((e) => {
      fileNameArr.push(e["file_name"]);
    });

    trueData = {
      csrf_test_name: csrfToken,
      rowdata: {
        id: dataForAJAX,
        file_names: fileNameArr,
      },
    };
  } else {
    let fileArr = [];
    console.log(data);
    data.forEach((e) => {
      if (e !== "[]") {
        fileArr.push(...JSON.parse(e));
      }
    });
    let fileNameArr = [];

    fileArr.forEach((e) => {
      fileNameArr.push(e["file_name"]);
    });

    trueData = {
      csrf_test_name: csrfToken,
      rowdata: {
        id: dataForAJAX,
        file_names: fileNameArr,
      },
    };
  }
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
