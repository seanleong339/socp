//contains functions that are used in checking of user study plan


function least(ele, check, num) {
    let count = 0;
    var result = {"mod": []};
    for (var y = 0; y < check.length; y++) {
        if (ele.indexOf(check[y]) > -1) {
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