// Adding event listeners for token generation

document.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("keyup", function (e) {
    createToken();
  });
  element.addEventListener("change", function (e) {
    createToken();
  });
});

// Destroy conditional inputs

function destroyConditionals() {
  document.querySelectorAll(".conditional").forEach((element) => {
    element.style.display = "none";
    element.value = "";
  });
}

// Control the inputs shown depending on token type selected

document.querySelectorAll("#token-type input").forEach((element) => {
  element.addEventListener("change", function (e) {
    customiseInputs(element.value);
    document
      .querySelectorAll("input:not(#token-type input), select")
      .forEach((element) => {
        element.value = "";
        createToken();
      });
    destroyConditionals();
  });
});

function customiseInputs(tokenType) {
  switch (tokenType) {
    case "component":
      document.querySelectorAll(".global-hidden").forEach((element) => {
        element.style.display = "block";
      });
      document.querySelectorAll(".alias-hidden").forEach((element) => {
        element.style.display = "block";
      });

      break;

    case "alias":
      document.querySelectorAll(".global-hidden").forEach((element) => {
        element.style.display = "block";
      });
      document.querySelectorAll(".alias-hidden").forEach((element) => {
        element.style.display = "none";
      });

      break;

    case "global":
      document.querySelectorAll(".global-hidden").forEach((element) => {
        element.style.display = "none";
      });

      document.querySelectorAll(".global-only-show").forEach((element) => {
        element.style.display = "block";
      });

      break;

    default:
      break;
  }
}

// Control the token properties depending on category selected

document.querySelectorAll("#token-category").forEach((element) => {
  element.addEventListener("change", function (e) {
    document.querySelector("#token-property").options.selectedIndex = 0;
    document.querySelector("#size-property").options.selectedIndex = 0;
    document.querySelector("#other-property").value = "";
    createToken();
    if (element.value == "size") {
      document.getElementById("token-scale").style.display = "block";
    } else {
      document.getElementById("token-scale").style.display = "none";
      destroyConditionals();
    }
    changeProperty(element.value);
  });
});

var propertiesByCategory = {
  colour: [
    { label: "General", value: "" },
    { label: "Foreground", value: "foreground" },
    { label: "Background", value: "background" },
    { label: "Text", value: "text" },
    { label: "Icon", value: "icon" },
    { label: "Border", value: "border" },
    { label: "Divider", value: "divider" },
    { label: "Stroke", value: "stroke" },
    { label: "Shade", value: "shade" },
    { label: "Other (please specify)", value: "" },
  ],
  size: [
    { label: "Height", value: "height" },
    { label: "Min height", value: "min-height" },
    { label: "Max height", value: "max-height" },
    { label: "Width", value: "width" },
    { label: "Min width", value: "min-width" },
    { label: "Max width", value: "max-width" },
    { label: "Radius", value: "radius" },
    { label: "Margin", value: "margin" },
    { label: "Padding", value: "padding" },
    { label: "Spacing Internal", value: "spacing-internal" },
    { label: "Other (please specify)", value: "" },
  ],
};

function changeProperty(value) {
  var propertyOptions = '<option value="">Select&hellip;</option>';
  if (value == "") {
    propertyOptions = '<option value="">Select&hellip;</option>';
  } else {
    for (let property of propertiesByCategory[value]) {
      propertyOptions += `<option value="${property.value}">${property.label}</option>`;
    }
  }
  document.getElementById("token-property").innerHTML = propertyOptions;
}

// Show/hide size options depending on property selected

document.querySelectorAll("#token-property").forEach((element) => {
  element.addEventListener("change", function (e) {
    if (document.querySelectorAll("#token-category")[0].selectedIndex == "2") {
      toggleSizeOptions(
        element.options[element.selectedIndex].text,
        element.value
      );
      changeSizeOptions(element.value);
    } else {
      document.getElementById("size-specs").style.display = "none";
    }
    if (
      element[element.selectedIndex].textContent == "Other (please specify)"
    ) {
      document.querySelector("#token-other-property").style.display = "block";
    } else {
      document.querySelector("#other-property").value = "";
      document.querySelector("#token-other-property").style.display = "none";
      createToken();
    }
  });
});

var optionsByProperty = {
  radius: [
    { label: "All corners", value: "" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
  ],
  margin: [
    { label: "All sides", value: "" },
    { label: "X-axis", value: "x" },
    { label: "Y-axis", value: "y" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ],
  padding: [
    { label: "All sides", value: "" },
    { label: "X-axis", value: "x" },
    { label: "Y-axis", value: "y" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ],
};

function changeSizeOptions(value) {
  var sizeOptions = '<option value="">Select&hellip;</option>';
  if (value == "") {
    sizeOptions = '<option value="">Select&hellip;</option>';
  } else if (value == "radius" || value == "margin" || value == "padding") {
    for (let option of optionsByProperty[value]) {
      sizeOptions += `<option value="${option.value}">${option.label}</option>`;
    }
  } else {
    sizeOptions = '<option value="">Select&hellip;</option>';
  }
  document.getElementById("size-property").innerHTML = sizeOptions;
}

function toggleSizeOptions(label, value) {
  if (value == "padding" || value == "margin" || value == "radius") {
    document.getElementById("sizing-type").innerHTML = label;
    document.getElementById("size-specs").style.display = "block";
  } else {
    document.getElementById("size-specs").style.display = "none";
  }
}

// Create the token

function createToken() {
  var token = [];
  var inputs = document.querySelectorAll("input, select");
  for (let input of inputs) {
    if (input.type == "radio") {
      // Do nothing
    } else {
      if (input.value) {
        var formattedString = input.value.replace(/\s+/g, "-").toLowerCase();
        token.push(formattedString);
      }
    }
  }

  document.getElementById("result").innerHTML = `<p class="token">${token.join(
    "-"
  )}</p>`;
}
