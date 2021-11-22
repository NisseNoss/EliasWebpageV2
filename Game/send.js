//Load name from local storage
let name = localStorage['name'] || false;


//Inputs the values and sends the form
function sendhighscore() {
    $("#p1").val(name);
    $("#p2").val(highscore);
    $("#p3").val("send");
    $("#f1").submit();
    //document.querySelector('#p1').value = name;
    //document.querySelector('#p2').value = highscore;
    //document.querySelector("#f1").submit();
}


//Submit the name
function namesubmit() {
    //console.log(document.querySelector("#name-input").value)
    name = document.querySelector("#name-input").value;

    //Save name to localstorage
    localStorage['name'] = name;
}

//Removes input if name saved
if (name) {
    console.log("To remove name, type localStorage.clear();");
    document.querySelector("#nameinput-sec").remove();
}