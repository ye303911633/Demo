let kits = {};

kits.localGet = function (key) {
    let json = localStorage.getItem(key);
    arr = json === null ? [] : JSON.parse(json);
    return arr;
}


kits.localSet = function(key, value){
    let json = JSON.stringify(value);
    localStorage.setItem(key, json);
}
