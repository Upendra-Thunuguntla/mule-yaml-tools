var keyPrefix = "";
var keySuffix = "";

var globalOp = "";

function processRemovePropValues(properties) {
    const lines = properties.split('\n');
    const newLines = [];

    lines.forEach((line) => {
        const [key, value] = line.split('=');

        let newValue = value;
        if (value.startsWith('![')) {
            newValue = '![]';
        } else {
            newValue = '';
        }

        newLines.push(`${key}=${newValue}`);
    });

    return newLines.join('\n');
}

function getPropKeysOnly(properties) {
    const lines = properties.split('\n');
    const newLines = [];

    lines.forEach((line) => {
        const [key, value] = line.split('=');
        newLines.push(keyPrefix + `${key}` + keySuffix);
    });
    return newLines.join('\n');
}

function filterOp(filterInput) {
    query = filterInput.value;
    if (query == "") {
        document.getElementById("YAMLOutput").value = globalOp;
    } else {
        var txtArr = globalOp.split("\n");
        var filterOp = txtArr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
        // console.log(filterOp);

        document.getElementById("YAMLOutput").value = filterOp.join("\n");
    }
}

function convertPropertiesToYAML(properties) {
    const lines = properties.trim().split('\n');
    const obj = {};

    lines.forEach((line) => {
        const [key, value] = line.split('=');
        const keys = key.split('.');

        let nestedObj = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            nestedObj[k] = nestedObj[k] || {};
            nestedObj = nestedObj[k];
        }

        nestedObj[keys[keys.length - 1]] = value;
    });

    return obj;
}

// Add event listener to convert button
function convert() {
    // Get reference to file input, textarea, and convert button
    var propFileInput = document.getElementById("propFileInput");
    var propTextarea = document.getElementById("propTextarea");

    // Check if file input or textarea is not empty
    if (propFileInput.files.length > 0 || propTextarea.value.trim().length > 0) {
        if (document.getElementById("addGenericProp").checked) {
            keyPrefix = "${";
            keySuffix = "}";

        } else if (document.getElementById("addMuleProp").checked) {
            keyPrefix = 'Mule::p("';
            keySuffix = '")';
        } else {
            keyPrefix = "";
            keySuffix = "";
        }
        try {
            if (keysOnly.checked) {
                op = getPropKeysOnly(propTextarea.value.trim());
                document.getElementById("filterProp").disabled = false;
            } else {
                op = convertPropertiesToYAML(propTextarea.value.trim());
                op = jsyaml.dump(op);
                document.getElementById("filterProp").disabled = true;
            }
            // let op = convertYamlToProperties(propTextarea.value.trim());
            // op = addCommentsAndLines(propTextarea.value.trim(),op.toString());
            document.getElementById("YAMLOutput").value = op.toString();
            globalOp = op.toString();
        } catch (error) {
            document.getElementById("YAMLOutput").style.color = "red";
            document.getElementById("YAMLOutput").value = error.toString();
            document.getElementById("downloadProp").disabled = true;
        }
    } else {
        alert("Please enter Properties or Choose a File");
    }
}

function removePropValues() {
    // Get reference to file input, textarea, and convert button
    var propFileInput = document.getElementById("propFileInput");
    var propTextarea = document.getElementById("propTextarea");
    document.getElementById("downloadYAML").disabled = true;
    try {
        op = processRemovePropValues(propTextarea.value.trim());
        document.getElementById("YAMLOutput").value = op.toString();
    } catch (error) {
        document.getElementById("YAMLOutput").style.color = "red";
        document.getElementById("YAMLOutput").value = error.toString();
    }
}

var openFile = function (event) {
    var input = event.target;
    var fileName = input.value.split('\\').pop();
    document.getElementById("propFileInputLabel").innerHTML = fileName;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        var node = document.getElementById('propTextarea');
        node.value = text;
    };
    reader.readAsText(input.files[0]);
};

// Non Functional requirements 
function loadPage() {
    clearContents();
    document.getElementById("propTextarea").focus();
}


function checkCheckboxes(data) {
    if (data == "keysOnly") {
        addGenericProp.disabled = !keysOnly.checked;
        addMuleProp.disabled = !keysOnly.checked;
        if (!keysOnly.checked) {
            addMuleProp.checked = false;
            addGenericProp.checked = false;
        }
    }

    else if (data == "addGenericProp") {
        addMuleProp.checked = false;
    }
    else if (data == "addMuleProp") {
        addGenericProp.checked = false;
    }
}

function copy() {
    if (YAMLOutput.value != "") {
        let textarea = document.getElementById("YAMLOutput");
        textarea.select();
        document.execCommand("copy");
    }
}

function clearContents() {
    propTextarea.value = "";
    document.getElementById("propFileInputLabel").innerHTML = "Choose a properties file...";
    propFileInput.value = ""
    YAMLOutput.value = "";
    YAMLFileName.hidden = true;
    document.getElementById("YAMLOutput").style.color = "black";
    document.getElementById("downloadYAML").disabled = false;
    document.getElementById("propTextarea").focus();
}

function downloadYAML() {
    if (document.getElementById("YAMLFileNameGroup").hidden == true && YAMLOutput.value != "" && document.getElementById("YAMLOutput").style.color == "black") {
        document.getElementById("YAMLFileNameGroup").hidden = false;
        document.getElementById("YAMLFileName").hidden = false;
        document.getElementById("YAMLFileName").focus();
        console.log("showing output file name input");
    } else if (YAMLOutput.value != "" && YAMLFileName.value != "") {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(YAMLOutput.value));
        element.setAttribute('download', YAMLFileName.value + ".yaml");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else {
        if (YAMLOutput.value != "" && YAMLFileName.value == "") {
            alert("Please enter file name");
        } else if (YAMLOutput.value.trim() == "" && YAMLFileName.value != "") {
            alert("Please check your input");
        } else {
            alert("Please check your input and file name");
        }
    }
}

