[![YAML Tools](https://miro.medium.com/v2/resize:fit:720/format:webp/0*VNyidRqsr60sdIKi.png)](https://upendra-thunuguntla.github.io/mule-yaml-tools/)


🌏 Web app Link : https://upendra-thunuguntla.github.io/mule-yaml-tools/

I created this tool with intention to help myself as well as fellow developers and community. So, let’s dig into it and see what it can do and how it can help you in day to day development as Mulesoft developer.

There are 2 options in this web application:

1️⃣ YAML to Properties Converter

2️⃣ Properties to YAML Converter

# YAML to Properties Converter
Using this section we can convert YAML file to Properties file. It has many other options.

![](https://miro.medium.com/v2/resize:fit:720/format:webp/1*6PY1ABIVBB5TE1AZfJujQA.png)

Choose a YAML file using browse button or Paste YAML content into the text area to start the process.
If you choose a file all the content will be automatically read from file and prefilled in the Text area.

🤞 Consider the following as input

```
database:
  host: "localhost"
```
## 🌠 Convert to Properties : 
Once the input is added, just click on Convert button to see the converted properties content in the result section.

```
database.host=localhost
```
## 🌠 Get Keys only : 
You can choose this option if you want to get only keys to use in mule flows. Choose and click on convert to process the input.

```
database.host
```

## 🌠 Enclose in ${\*\*key**}: 
You can choose this option if you want to get only keys but add generic property placeholder. Choose Get keys only and this then click on convert to process the input.

This will be enabled only if Get Keys only option is checked
```
${database.host}
```

## 🌠 Enclose in Mule::p(“\*\*key**”): 
You can choose this option if you want to get only keys but add Dataweave property placeholder. Choose Get keys only and this then click on convert to process the input.

This will be enabled only if Get Keys only option is checked
```
Mule::p("database.host")
```

## 🥳 Filter on elements: 
This option allows user to filter through output properties to fetch only those that are matching the filter criteria

## 🌠 Remove YAML Values: 

This conversion is useful when moving from environment to environment such as **DEV** to **UAT** or **UAT** to **PROD** etc.

We happen to forget adding some key-value pairs when moving to different environments as there will be seperate file used. This will solve that issue by removing all the values from input and keeping the keys and empty placeholders for the user to add new values.

```
database:
 host: ''
```
## 📋 Copy to Clipboard: 
Copies the Content in Result section to Clipboard.

## 📁Download : 
Takes file name as input and downloads a file with Given name and resulting output.

> 🚀 If any value is a encrypted value i.e., starts with ![ then in the result of Get Keys only will have secure:: appended as prefix to each entry.

# Properties to YAML Converter
This section also has similar functions as previous and works in a similar manner while providing vast range of fucntions.

![](https://miro.medium.com/v2/resize:fit:720/format:webp/1*F3RRCYxrciNMapHX2Ewpxw.png)

Make sure to bookmark this link and share with fellow developers 🐱‍🏍.




