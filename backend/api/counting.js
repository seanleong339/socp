//contains functions that are used in checking of user study plan

/**
 * 
 * @param {*} ele the modules of the user's study plan
 * @param {*} check the modules that are in the criteria for a specific major/specialisation
 * @param {*} num the minimum number of modules in ele that have to be in the check
 * @returns 
 */
function least(ele, check, num) {
    let count = 0;
    var result = {"mod": []};
    for (var y = 0; y < check.length; y++) {
        if (ele.indexOf(check[y].toUpperCase()) > -1) {
            result.mod.push(check[y])
            count += 1;
            if (count >= num) {
                result.pass = true;
                return result;
            };
        }
    };
    result.pass = false;
    return result;
}

module.exports = least;