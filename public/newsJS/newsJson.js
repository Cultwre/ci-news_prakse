const newsJSON = function () {
  let layout = {
    schema: {},
    value: {},
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
      layout.schema[e.column_name] = parsedObjects[0];
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
      layout["form"].push(parsedObjects[0]);
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

  console.log(layout);
  $("#news-form").jsonForm(layout);

  // const subDropdown = document.getElementsByName("subcategory_id")[0];
  // const mainDropdown = document.getElementsByName("category_id")[0];
  // const mainDropdownValue = document.getElementsByName("category_id")[0].value;

  // let = categoryArr = [];
  // console.log(subDropdownValues);

  // mainDropdown.onload = subDropdownValues.forEach((e) => {
  //   if (e.parent_id == mainDropdownValue) {
  //     let newOption = new Option(e.news_category, e.id);
  //     subDropdown.add(newOption, undefined);
  //   }
  // });

  // mainDropdown.addEventListener("change", function (e) {
  //   const mainDropdownValueLive =
  //     document.getElementsByName("category_id")[0].value;

  //   while (subDropdown.options.length > 0) {
  //     subDropdown.remove(0);
  //   }

  //   console.log("deez");

  //   subDropdownValues.forEach((e) => {
  //     if (e.parent_id == mainDropdownValueLive) {
  //       let newOption = new Option(e.news_category, e.id);
  //       subDropdown.add(newOption, undefined);
  //     }
  //   });
  // });

  // ***********************************************************************************************

  // const filesInput = document.getElementsByName("json_data")[0];
  // filesInput.setAttribute("multiple", "multiple");

  // var element = document.createElement("div");
  // element.className = "filePreview";
  // filesInput.parentElement.appendChild(element);
  // console.log(element);

  // filesInput.addEventListener("change", function (e) {
  //   const filePreviews = document.getElementsByClassName("filePreview")[0];

  //   filePreviews.innerHTML = "";

  //   filePreviews.innerHTML = `<button class="removeAll" >Remove all</button>`;

  //   for (const file of filesInput.files) {
  //     const previewElement = document.createElement("div");

  //     if (file.type.startsWith("image/")) {
  //       // For image files, display a thumbnail
  //       const thumbnail = document.createElement("img");
  //       thumbnail.classList.add("image-thumbnail");

  //       thumbnail.style.width = "auto";
  //       thumbnail.style.height = "100px";

  //       thumbnail.src = URL.createObjectURL(file);
  //       previewElement.appendChild(thumbnail);
  //     } else {
  //       const icon = document.createElement("i");

  //       icon.classList.add("fa-regular", "fa-file-lines");

  //       previewElement.appendChild(icon);
  //     }

  //     const fileNameElement = document.createElement("div");
  //     fileNameElement.className = "fileName";

  //     fileNameElement.textContent = file.name;

  //     previewElement.appendChild(fileNameElement);

  //     let inputList = filesInput.files;
  //     console.log(inputList);

  //     newFiles = Array.from(filesInput.files);

  //     filesArr = newFiles;
  //     console.log(newFiles);

  //     for (let i = 0; inputList.length > i; i++) {
  //       if (!newFiles.includes(inputList[i])) {
  //         newFiles.push(inputList[i]);
  //       }
  //     }

  //     const removeButton = document.createElement("button");
  //     removeButton.textContent = "Remove";
  //     removeButton.addEventListener("click", (e) => {
  //       e.preventDefault();

  //       let idx = newFiles.indexOf(file);

  //       newFiles.splice(idx, 1);

  //       console.log(newFiles);

  //       filesArr = newFiles;

  //       console.log(filesArr);

  //       previewElement.remove();
  //     });

  //     const remAllBtn = document.querySelector(`.removeAll`);
  //     remAllBtn.addEventListener("click", function (e) {
  //       e.preventDefault();

  //       filesInput.value = ``;
  //       filePreviews.innerHTML = ``;
  //       console.log(newFiles);

  //       filesArr = newFiles;
  //       filesArr = [];
  //       console.log(filesArr);
  //     });

  //     previewElement.appendChild(removeButton);

  //     filePreviews.appendChild(previewElement);
  //   }
  // });
};
