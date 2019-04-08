var thescript = document.getElementById("welcome to handlebars").innerHTML;
var theTemplate = Handlebars.compile(thescript);
var contextObj = {Hackathon: "Bostonhacks"};
var compiledData = theTemplate(contextObj);
document.getElementById("test").innerHTML = compiledData;