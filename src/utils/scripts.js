import _ from "lodash";
import empty from "is-empty";
import helper from "./helper";
import moment from "moment";

export const removeCommas = str => _.replace(str, new RegExp(",", "g"), "");
const reverseString = str => removeCommas(_.toString(_.reverse(_.toArray(str))));

const recursiveReverse = input => {
    if (_.isArray(input)) return _.toString(_.reverse(_.map(input, v => recursiveReverse(v))));
    if (_.isString) return reverseString(input);
    return reverseString(`${input}`);
};

export const formatNumber = (v = 0, size = 3) => {
    let str = `${v}`;
    if (empty(str)) return "NaN";
    let substr = str.split(".");
    if (substr[1] === undefined) {
        substr.push('000000');
    } else {
        substr[1] = helper.sixDigitsNumber(substr[1]);
    }
    str = reverseString(substr[0]);
    const regex = `.{1,${size}}`;
    const arr = str.match(new RegExp(regex, "g"));
    return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};

export const localTime = (stringData) => {
    return moment(new Date(stringData).toString()).format('dddd MMMM Do YYYY, h:mm:ss a');
};

export const emptyFunc = () => ({});

export const stringToNumber = (stringData) => {
    return +stringData;
};

export const randomNum = (min, max) => {
    let randomNumbers = [];
    for (let i = 0; i < 3; i++) {
        let random_number = Math.floor(Math.random() * (max - min) + min);
        if (randomNumbers.indexOf(random_number) === -1) {
            randomNumbers.push(random_number);
        }
    }
    return randomNumbers;
};

export const stringTruncate = (str) => {
    if (str.length > 30) {
        return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
    }
    return str;
};

export const fileTypeCheck = (filePath) => {
    let allowedExtensions =
        /(\.json)$/i;
    return allowedExtensions.exec(filePath);
};