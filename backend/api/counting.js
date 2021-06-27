//contains functions that are used in checking of user study plan

/**
 * 
 * @param {*} ele the modules of the user's study plan
 * @param {*} check the modules that are in the criteria for a specific major/specialisation
 * @param {*} num the minimum number of modules in ele that have to be in the check
 * @returns result an object containing the modules that are present in both ele and check, and if ele passes the check
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


function count(ele, check) {
    let count = 0;
    for (var y = 0; y < check.length; y++) {
        if (ele.indexOf(check[y].toUpperCase()) > -1) {
            count += 1;
        }
    };
    return count;
}

function modin(ele, check) {
    let result = { mod: [] };
    for (var y = 0; y < check.length; y++) {
        if (ele.indexOf(check[y].toUpperCase()) > -1) {
            result.mod.push(check[y])
        }
    }
    return result;
}

// input major, crit is criteria from database and ele is the modules in the user plan.
function elective(major, crit, ele) {
    let result = {};
    if (major == "business analytics") {
        let listA = count(ele, crit.elective.lista);
        let listB = count(ele, crit.elective.listb);
        let listC = count(ele, crit.elective.listc);
        let total = listA + listB + listC;
        if (total < 6) {
            result.pass = false;
            result.lista = least(ele, crit.elective.lista, 2);
            result.listb = least(ele, crit.elective.listb, 2);
            result.listc = modin(ele, crit.elective.listc);
        }
        else {
            result.pass = true;
        }
    };

    if (major == "information systems") {
        result = least(ele, crit.elective, 7);
    };

    if (major == "information security") {
        result = least(ele, crit.elective, 3);
    };

    if (major == "computer science") {
        result = least(ele, crit.elective.primary, 3);
    }
    return result;
}

module.exports = {
    least,
    elective,
    count,
    modin
};
