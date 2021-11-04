import _ from "lodash";
import empty from "is-empty";
import helper from "./helper";

const removeCommas = str => _.replace(str, new RegExp(",", "g"), "");
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

