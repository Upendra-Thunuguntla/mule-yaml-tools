var keyPrefix = "";
var keySuffix = "";

var globalOp = "";

function loadExample(){
    document.getElementById("yamlTextarea").value= "string: Hello, World!\r\nnumber: 42\r\nboolean: true\r\narray:\r\n  - 1\r\n  - 2\r\n  - 3\r\nobject:\r\n  property: value\r\n  nestedObject:\r\n    nestedProperty: nestedValue\r\n";
    gtag('event', 'load example', {});
}

// Function to convert YAML data to properties format
function convertYamlToProperties(yamlData, keysOnly) {
    // Parse YAML data
    const data = jsyaml.load(yamlData);
    // Initialize properties string
    let properties = "";
    // Iterate over all keys in the data object
    for (const key of Object.keys(data)) {
        // Recursively process sub-objects
        function processObject(obj, prefix) {
            if (typeof obj === "object") {
                // console.log(Object.keys(obj));
                for (const k of Object.keys(obj)) {
                    const value = obj[k];
                    if (typeof value === "object") {
                        processObject(value, `${prefix}${k}.`);
                    } else {
                        if (keysOnly) {
                            console.log(value);
                            if (value.startsWith('![')) {
                                properties += `${keyPrefix}secure::${prefix}${k}${keySuffix}\n`;
                            }else{
                                properties += `${keyPrefix}${prefix}${k}${keySuffix}\n`;
                            }
                        } else {
                            properties += `${prefix}${k}=${value}\n`;
                        }
                    }
                }
            } else {
                //This Else block is for First key-value pair in the input.
                if (keysOnly) {
                    if (obj.startsWith('![')) {
                        properties += `${keyPrefix}secure::${prefix.slice(0, -1)}${keySuffix}\n`;
                    }else{
                        properties += `${keyPrefix}${prefix.slice(0, -1)}${keySuffix}\n`;
                    }
                    // properties += keyPrefix + prefix.slice(0, -1) + keySuffix + `\n`;
                } else {
                    properties += prefix.slice(0, -1) + `=${obj}\n`;
                }
            }
        }
        processObject(data[key], `${key}.`);
    }
    // Return properties string
    return properties;
}


function addCommentsAndLines(yaml, properties) {
    yaml = yaml.split("\n");
    properties = properties.split("\n");
    for (let i = 0; i < yaml.length; i++) {
        const line = yaml[i];
        if (line.startsWith("#") || line.trim() === "") {
            properties.insert(i, line);
        }
    }
    return properties.join("\n");
}

function removeYamlValues() {
    // Get reference to file input, textarea, and convert button
    var yamlFileInput = document.getElementById("yamlFileInput");
    var yamlTextarea = document.getElementById("yamlTextarea");

    // Check if file input or textarea is not empty
    if (yamlFileInput.files.length > 0 || yamlTextarea.value.trim().length > 0) {
        try {
            let yamlData = yamlTextarea.value.trim();
            const data = jsyaml.load(yamlData);

            for (const key of Object.keys(data)) {
                // var obj = data[key];
                console.log(data[key]);
                if (typeof data[key] === "object") {
                    // Recursively process sub-objects
                    processYamlObject(data[key]);
                } else {
                    if (data[key].startsWith('![')) {
                        data[key] = "![]";
                    } else {
                        data[key] = "";
                    }
                }
            }
            const output = jsyaml.dump(data);
            // let op = convertYamlToProperties(yamlTextarea.value.trim());
            // op = addCommentsAndLines(yamlTextarea.value.trim(),op.toString());
            document.getElementById("propertiesOutput").value = output.toString();
            document.getElementById("filterProp").disabled = true;
        } catch (error) {
            document.getElementById("propertiesOutput").style.color = "red";
            document.getElementById("propertiesOutput").value = error.toString();
            document.getElementById("downloadProp").disabled = true;
        }
    }
}

function processYamlObject(obj) {
    for (const k of Object.keys(obj)) {
        const value = obj[k];
        console.log(obj[k]);
        if (typeof value === "object") {
            processYamlObject(obj[k]);
        } else {
            if (obj[k].startsWith('![')) {
                obj[k] = "![]";
            } else {
                obj[k] = "";
            }
        }
    }
}

//Function for removing values from YAML input File
function ProcessRemoveYamlValues(yamlData) {
    const obj = jsyaml.load(yamlData);
    // Iterate through all properties and replace values with empty strings
    for (const prop in obj) {
        // if (obj[prop].)
        obj[prop] = '';
    }
    // Convert modified object back into YAML
    const output = yaml.safeDump(obj);
    return output;
}

// Add event listener to convert button
function convert() {
    // Get reference to file input, textarea, and convert button
    var yamlFileInput = document.getElementById("yamlFileInput");
    var yamlTextarea = document.getElementById("yamlTextarea");

    // Check if file input or textarea is not empty
    if (yamlFileInput.files.length > 0 || yamlTextarea.value.trim().length > 0) {
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
            let op = convertYamlToProperties(yamlTextarea.value.trim(), keysOnly.checked);
            // op = addCommentsAndLines(yamlTextarea.value.trim(),op.toString());
            document.getElementById("propertiesOutput").value = op.toString();
            document.getElementById("filterProp").disabled = false;
            globalOp = op.toString();
        } catch (error) {
            document.getElementById("propertiesOutput").style.color = "red";
            document.getElementById("propertiesOutput").value = error.toString();
            document.getElementById("downloadProp").disabled = true;
        }
    } else {
        alert("Please enter YAML data or Choose a File");
    }
}

var openFile = function (event) {
    var input = event.target;
    var fileName = input.value.split('\\').pop();
    document.getElementById("yamlFileInputLabel").innerHTML = fileName;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        var node = document.getElementById('yamlTextarea');
        node.value = text;
    };
    reader.readAsText(input.files[0]);
    gtag('event', 'file uploaded', {});
};

function filterOp(filterInput) {
    query = filterInput.value;
    if (query == "") {
        document.getElementById("propertiesOutput").value = globalOp;
    } else {
        var txtArr = globalOp.split("\n");
        var filterOp = txtArr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
        // console.log(filterOp);

        document.getElementById("propertiesOutput").value = filterOp.join("\n");
    }
}

// Non Functional requirements 
function loadPage() {
    clearContents();
    document.getElementById("yamlTextarea").focus();
}

function copy() {
    if (propertiesOutput.value != "") {
        let textarea = document.getElementById("propertiesOutput");
        textarea.select();
        document.execCommand("copy");
        gtag('event', 'Props Op Copied', {});
    }
}

function clearContents() {
    yamlTextarea.value = "";
    document.getElementById("yamlFileInputLabel").innerHTML = "Choose a yaml file...";
    yamlFileInput.value = ""
    propertiesOutput.value = "";
    propFileName.hidden = true;
    document.getElementById("propertiesOutput").style.color = "black";
    document.getElementById("downloadProp").disabled = false;
    document.getElementById("filterProp").disabled = true;
    gtag('event', 'Contents Cleared', {});
}

function downloadProp() {
    if (document.getElementById("propFileNameGroup").hidden == true && propertiesOutput.value != "" && document.getElementById("propertiesOutput").style.color == "black") {
        document.getElementById("propFileNameGroup").hidden = false;
        document.getElementById("propFileName").hidden = false;
        document.getElementById("propFileName").focus();
        console.log("showing output file name input");
    } else if (propertiesOutput.value != "" && propFileName.value != "") {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(propertiesOutput.value));
        element.setAttribute('download', propFileName.value + ".properties");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        gtag('event', 'Content Downloaded', {});
    } else {
        if (propertiesOutput.value != "" && propFileName.value == "") {
            alert("Please enter file name");
        } else if (propertiesOutput.value.trim() == "" && propFileName.value != "") {
            alert("Please check your input");
        } else {
            alert("Please check your input and file name");
        }
    }
}

function checkCheckboxes(data) {
    if (data == "keysOnly") {
        addGenericProp.disabled = !keysOnly.checked;
        addMuleProp.disabled = !keysOnly.checked;
        if (!keysOnly.checked) {
            addMuleProp.checked = false;
            addGenericProp.checked = false;
        }
        gtag('event', 'selected keys only option', {});
    }

    else if (data == "addGenericProp") {
        addMuleProp.checked = false;
        gtag('event', 'selected generic prop options', {});
    }
    else if (data == "addMuleProp") {
        addGenericProp.checked = false;
        gtag('event', 'selected mule prop option', {});
    }
}

// document.getElementById("keysOnly").addEventListener('change', function(event) {
//     console.log("working");
//     addGenericProp.disabled = !keysOnly.checked;
// });
Array.prototype.insert = function (index, ...items) {
    this.splice(index, 0, ...items);
};