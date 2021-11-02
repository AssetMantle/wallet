import _ from "lodash";
import empty from "is-empty";
export const nilCheck = arr => !_.every(arr, el => !_.isNil(el));

//  planning on recreating this with css and components in the future(already mostly done)
export const reduceString = (str, from, end) => (str ? str.substring(0, from) + " ... " + str.substring(str.length - end) : "-");

export const stringNumCheck = input => !empty(input) && !isNaN(Number(input));

const removeCommas = str => _.replace(str, new RegExp(",", "g"), "");
const reverseString = str => removeCommas(_.toString(_.reverse(_.toArray(str))));

const recursiveReverse = input => {
    if (_.isArray(input)) return _.toString(_.reverse(_.map(input, v => recursiveReverse(v))));
    if (_.isString) return reverseString(input);
    return reverseString(`${input}`);
};

//  honestly not the brightest implementation, but it works so whatev.
export const formatNumber = (v = 0, size = 3) => {
    let str = `${v}`;
    if (empty(str)) return "NaN";
    let substr = str.split(".");
    str = reverseString(substr[0]);

    const regex = `.{1,${size}}`;
    const arr = str.match(new RegExp(regex, "g"));
    console.log(arr, "revers string");

    return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};