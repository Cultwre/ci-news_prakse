const newsJSON = function (valuePassed = null, view = false) {
  let layout = {
    schema: {},
    value: {},
    onSubmit: function (error, values) {
      let checkForFilesInputs = [];

      metaAttributes.forEach((e) => {
        parsedObjectsCheck = JSON.parse(e.attributes_json);
        if (e.table_name === userInput) {
          let filesTypeCheck = parsedObjectsCheck.filter(
            (e) => e.type == "file"
          );

          if (filesTypeCheck.length !== 0) {
            checkForFilesInputs.push(".");
          }
        }
      });

      let dataForAjax = {};

      if (checkForFilesInputs.length == 0) {
        if (valuePassed == null) {
          for (const key in values) {
            if (values.hasOwnProperty(key) && key !== "id") {
              const value = values[key];
              dataForAjax[key] = value;
            }
          }
        } else {
          for (const key in values) {
            if (values.hasOwnProperty(key)) {
              const value = values[key];
              dataForAjax[key] = value;
            }
          }
        }

        let dataToBeSended = {
          csrf_test_name: csrfToken,
          rowdata: dataForAjax,
        };

        $.ajax({
          url:
            valuePassed == null
              ? `${userInput}/createRecord`
              : `${userInput}/editRecord`,
          type: "POST",
          data: dataToBeSended,
          success: function (res) {
            location.reload();
          },
          error: error,
        });
      } else {
        const formElement = document.querySelector("#news-form");
        formElement.enctype = "multipart/form-data";
        formElement.name = "files[]";
        let columnForFile;

        metaAttributes.forEach((e, i) => {
          let parsedObjectsFiles = JSON.parse(e.attributes_json);
          if (e.table_name === userInput && e.form_part === "Form") {
            let filesType = parsedObjectsFiles.filter((e) => e.type == "file");
            if (filesType.length !== 0) {
              columnForFile = parsedObjectsFiles[0].key;
            }
          }
        });

        if (valuePassed == null) {
          for (const key in values) {
            if (values.hasOwnProperty(key) && key !== "id") {
              const value = values[key];
              dataForAjax[key] = value;
            }
          }
        } else {
          for (const key in values) {
            if (values.hasOwnProperty(key)) {
              const value = values[key];
              dataForAjax[key] = value;
            }
          }
        }

        if (valuePassed !== null) {
          let filesPassed;

          metaAttributes.forEach((e, i) => {
            let parsedObjectsFiles = JSON.parse(e.attributes_json);
            if (e.table_name === userInput && e.form_part === "Form") {
              let filesType = parsedObjectsFiles.filter(
                (e) => e.type == "file"
              );
              if (filesType.length !== 0) {
                filesPassed = valuePassed[0][parsedObjectsFiles[0].key];
              }
            }
          });

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
            const selectedUrls = Array.from(selectedFiles).map(
              (file) => file.value
            );

            filesPassed.forEach((e) => {
              if (selectedUrls.some((r) => e["file_url"].includes(r))) {
                arrayOfOldFiles.push(e);
              }
            });

            dataForAjax["old_files"] = arrayOfOldFiles;
          }

          allCheckboxes.forEach((e) => {
            if (e.checked == false) {
              arrayOfnonSelectedFiles.push(e);
            }
          });

          if (arrayOfnonSelectedFiles.length !== 0) {
            const nonSelectedUrls = Array.from(arrayOfnonSelectedFiles).map(
              (file) => file.value
            );

            filesPassed.forEach((e) => {
              if (nonSelectedUrls.some((r) => e["file_url"].includes(r))) {
                arrayOfFiles.push(e);
              }
            });

            dataForAjax["saved_files"] = arrayOfFiles;
          }
        }

        dataForAjax["column_files"] = columnForFile;
        console.log(dataForAjax);

        var formData = new FormData();
        formData.append("csrf_test_name", csrfToken);
        formData.append("rowdata", JSON.stringify(dataForAjax));

        for (var i = 0; i < filesArr.length; i++) {
          formData.append("files[]", filesArr[i]);
        }

        $.ajax({
          url:
            valuePassed == null
              ? `${userInput}/createFilesRecord`
              : `${userInput}/editFilesRecord`,
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,

          success: function (res) {
            location.reload();
          },
          error: error,
        });
      }
    },
  };

  function convertStringToArrayIfValid(str) {
    if (isStringArray(str)) {
      try {
        const trimmedStr = str.trim();
        const array = JSON.parse(trimmedStr);

        if (Array.isArray(array)) {
          return array;
        }
      } catch (error) {}
    }
    return str;
  }

  function isStringArray(str) {
    return str.trim().startsWith("[") && str.trim().endsWith("]");
  }

  metaAttributes.forEach((e) => {
    parsedObjects = JSON.parse(e.attributes_json);
    if (e.table_name === userInput && e.form_part === "Schema") {
      for (const obj of parsedObjects) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] === "false") {
              obj[key] = false;
            } else if (obj[key] === "true") {
              obj[key] = true;
            } else if (isStringArray(obj[key])) {
              obj[key] = convertStringToArrayIfValid(obj[key]);
            }
          }
        }
      }
      // layout.schema[e.column_name] = parsedObjects[0];
      if (view == true) {
        parsedObjects[0]["readonly"] = true;
        parsedObjects[0]["disabled"] = true;
        layout.schema[e.column_name] = parsedObjects[0];
      } else {
        layout.schema[e.column_name] = parsedObjects[0];
      }
    }
  });

  const filteredObjectsForForm = metaAttributes.filter(
    (obj) => obj.table_name === userInput && obj.form_part === "Form"
  );
  const filteredObjectForReference = metaAttributes.filter(
    (obj) => obj.table_name === userInput && obj.form_part === "Reference"
  );

  if (filteredObjectsForForm.length > 0) {
    layout["form"] = [];
    filteredObjectsForForm.forEach((e) => {
      parsedObjects = JSON.parse(e.attributes_json);
      for (const obj of parsedObjects) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] === "false") {
              obj[key] = false;
            } else if (obj[key] === "true") {
              obj[key] = true;
            } else if (isStringArray(obj[key])) {
              obj[key] = convertStringToArrayIfValid(obj[key]);
            }
          }
        }
      }
      if (view == true) {
        if (parsedObjects[0].type !== "submit") {
          layout["form"].push(parsedObjects[0]);
        }
      } else {
        layout["form"].push(parsedObjects[0]);
      }
    });
  }
  const pushCategoriesToSchema = function (filtredReference) {
    let titleObj = {};
    let keyOfCategories = JSON.parse(filtredReference.attributes_json)[0]
      .reference_column;
    let keyOfValue = JSON.parse(filtredReference.attributes_json)[0]
      .reference_value;

    let dropdownData = dropdownValues.filter((e) =>
      e.hasOwnProperty(keyOfCategories)
    );
    dropdownData = dropdownData[0][keyOfCategories];
    let dataForEnum = [];

    dropdownData.forEach((e) => {
      dataForEnum.push(e.id);
      titleObj[e.id] = e[keyOfValue];
    });

    layout.schema[keyOfCategories]["enum"] = dataForEnum;
    layout.form.find((obj) => obj.key === keyOfCategories)["titleMap"] =
      titleObj;
  };

  if (filteredObjectForReference.length !== 0) {
    if (filteredObjectForReference.length > 1) {
      filteredObjectForReference.forEach((e) => {
        console.log(e);
        pushCategoriesToSchema(e);
      });
    } else {
      pushCategoriesToSchema(filteredObjectForReference[0]);
    }
  }

  if (valuePassed !== null) {
    console.log(valuePassed);

    layout.value = valuePassed[0];
  }

  console.log(layout);
  $("#news-form").jsonForm(layout);

  if (
    view == true &&
    document.querySelector("#news-form").querySelector('[type="submit"]')
  ) {
    document
      .querySelector("#news-form")
      .querySelector('[type="submit"]')
      .remove();
  }

  if (filteredObjectForReference.length !== 0) {
    let subcolumn = JSON.parse(filteredObjectForReference[0].attributes_json)[0]
      .reference_subcolumn;
    let maincolumn = JSON.parse(
      filteredObjectForReference[0].attributes_json
    )[0].reference_column;

    if (subcolumn !== undefined) {
      filteredObjectForReference.forEach((e) => {
        let subcolumn = JSON.parse(e.attributes_json)[0].reference_subcolumn;
        let maincolumn = JSON.parse(e.attributes_json)[0].reference_column;

        const subDropdown = document.getElementsByName(subcolumn)[0];
        const mainDropdown = document.getElementsByName(maincolumn)[0];
        const mainDropdownValue =
          document.getElementsByName(maincolumn)[0].value;

        let dropdownData = subDropdownValues.filter((e) =>
          e.hasOwnProperty(subcolumn)
        );

        let subValues = dropdownData[0][subcolumn];
        let valueProperty = JSON.parse(e.attributes_json)[0].reference_value;

        mainDropdown.onload = subValues.forEach((e) => {
          if (e.parent_id == mainDropdownValue) {
            let newOption = new Option(e[valueProperty], e.id);
            subDropdown.add(newOption, undefined);
          }
        });

        mainDropdown.addEventListener("change", function (e) {
          const mainDropdownValueLive =
            document.getElementsByName(maincolumn)[0].value;
          while (subDropdown.options.length > 0) {
            subDropdown.remove(0);
          }
          subValues.forEach((e) => {
            if (e.parent_id == mainDropdownValueLive) {
              let newOption = new Option(e[valueProperty], e.id);
              subDropdown.add(newOption, undefined);
            }
          });
        });
      });
    }
  }

  metaAttributes.forEach((e, i) => {
    parsedObjects = JSON.parse(e.attributes_json);
    if (e.table_name === userInput && e.form_part === "Form") {
      let filesType = parsedObjects.filter((e) => e.type == "file");

      if (filesType.length !== 0) {
        let filesInput = document.getElementsByName(filesType[0].key)[0];

        if (filesType[0].multiple == "true") {
          filesInput.setAttribute("multiple", "multiple");
        }

        var element = document.createElement("div");
        element.className = `filePreview${i}`;
        filesInput.parentElement.appendChild(element);

        if (valuePassed !== null) {
          const hrElement = document.createElement("hr");
          filesInput.parentElement.appendChild(hrElement);

          var elementOld = document.createElement("div");
          elementOld.className = `filePreviewOld${i}`;
          filesInput.parentElement.appendChild(elementOld);

          let files = valuePassed[0][parsedObjects[0].key];

          const filePreviews = document.getElementsByClassName(
            `filePreviewOld${i}`
          )[0];

          filePreviews.innerHTML = "";

          if (view == true) {
            filesInput.remove();
          }

          if (Array.isArray(files)) {
            files.forEach((e) => {
              const previewElement = document.createElement("div");

              if (view !== true) {
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
          let filePreviews = document.getElementsByClassName(
            `filePreview${i}`
          )[0];

          filePreviews.innerHTML = "";

          if (filesType[0].multiple == "true") {
            filePreviews.innerHTML = `<button class="removeAll${i}" >Remove all</button>`;
          }

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

            newFiles = Array.from(filesInput.files);

            filesArr = newFiles;

            for (let i = 0; inputList.length > i; i++) {
              if (!newFiles.includes(inputList[i])) {
                newFiles.push(inputList[i]);
              }
            }

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

            if (filesType[0].multiple == "true") {
              const remAllBtn = document.querySelector(`.removeAll${i}`);
              remAllBtn.addEventListener("click", function (e) {
                e.preventDefault();

                filesInput.value = ``;
                filePreviews.innerHTML = ``;
                console.log(newFiles);

                filesArr = newFiles;
                filesArr = [];
                console.log(filesArr);
              });
            }

            previewElement.appendChild(removeButton);

            filePreviews.appendChild(previewElement);
          }
        });
      }
    }
  });
};

const deletingRecord = function (id, multiple = false, error) {
  let columnForFile;
  let fileNameArr = [];

  metaAttributes.forEach((e, i) => {
    let parsedObjectsFiles = JSON.parse(e.attributes_json);
    if (e.table_name === userInput && e.form_part === "Form") {
      let filesType = parsedObjectsFiles.filter((e) => e.type == "file");
      if (filesType.length !== 0) {
        columnForFile = parsedObjectsFiles[0].key;
      }
    }
  });

  if (multiple == true) {
    let array = [];

    dbData.forEach((e) => {
      console.log(e);
      if (id.some((r) => e["id"].includes(r))) {
        array.push(e[columnForFile]);
      }
    });

    array.forEach((e) => {
      if (Array.isArray(e)) {
        e.forEach((e) => {
          fileNameArr.push(e["file_name"]);
        });
      }
    });

    console.log(fileNameArr);
  } else {
    console.log(columnForFile);
    let filtredData = dbData.filter((e) => e.id == id);
    console.log(id);
    filtredData = filtredData[0][columnForFile];

    if (Array.isArray(filtredData)) {
      filtredData.forEach((e) => {
        fileNameArr.push(e["file_name"]);
      });
    }

    console.log(fileNameArr);
  }

  let dataForAjax = {
    csrf_test_name: csrfToken,
    rowdata: {
      id: id,
      file_names: fileNameArr,
    },
  };

  console.log(dataForAjax);

  $.ajax({
    url:
      multiple == false
        ? `${userInput}/deleteRecord`
        : `${userInput}/deleteMultipleRecords`,
    type: "POST",
    data: dataForAjax,
    success: function () {
      location.reload();
    },
    error: error,
  });
};
