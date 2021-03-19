function randomNum(min, max) {
    let randomNumbers = [];
    for(var i=0;i<3;i++){
        var random_number = Math.floor(Math.random()*(max - min) + min);
        if (randomNumbers.indexOf(random_number) == -1) {
            randomNumbers.push( random_number );
        }

    }
    return randomNumbers;
}
function stringTruncate(str){
    if(str.length > 30){
        return str.substr(0,18) + '...' + str.substr(str.length-10, str.length);
    }
    return str;
}
module.exports = {
    randomNum,
    stringTruncate,
};