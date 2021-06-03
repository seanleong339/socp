let object = {
    "one": ["2", "3", "4"],
    "two": ["5", "6"],
    "three": ["7", "8", "11", "12"]
}

let criteria = {
    "major": "test",
    "core": ["4", "5", "6"],
    "least2": [ "12", "13", "11"],
    "least3": ["15", "14", "16", "17", "18"]
}


function least2(ele, crit) {
    let count = 0;
    for (var y = 0; y < crit.least2.length; y++){
        if (ele.indexOf(crit.least2[y]) > -1) {
            count += 1;
            if (count >= 2) {
                console.log("nested")
                return true;
            };
        }
    };
    return false;
}

function least3(ele, crit) {
    let count = 0;
    for (var y = 0; y < crit.least3.length; y++){
        if (ele.indexOf(crit.least3[y]) > -1) {
            count += 1;
            if (count >= 3) {
                console.log("nested")
                return true;
            };
        }
    };
    return false;
}



class tester {
    static testout(plans) {
        let result = {};
        const compare = plans.one.concat(plans.two, plans.three);

        if (criteria.core.every(x => compare.indexOf(x) > -1)) {
            console.log("core is true");
            result.core = true;
        }
        else {
            console.log(false);
            result.core = false;
        }
        if (criteria.least2) {
            if (least2(compare, criteria)) {
                console.log("set1 criteria met");
                result.least2 = true;
            }
            else {
                console.log("set1 criteria not met")
                result.least2 = false;
            }
        }
        if (criteria.least3) {
            if (least3(compare, criteria)) {
                console.log("set2 criteria met");
                result.least3 = true;
            }
            else {
                console.log("set2 criteria not met")
                result.least3 = false;
            }
        }
        console.log(result)
    }
}

let result = tester.testout(object);
