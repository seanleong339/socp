var assert = require('assert');
const counting = require('../api/counting.js')


describe('Criteria', function () {
    describe('Least', function () {
        it('should return pass as true and modules taken when the least requirement is met', function () {
            var ele = ['CS1231', 'CS2100', 'CS2030', 'CS2040'];
            var check = ['cs1231', 'cs2106', 'cs2102', 'cs2040'];
            var expect = {
                mod: ['cs1231', 'cs2040'],
                pass: true
            };
            assert.deepStrictEqual(counting.least(ele, check, 2), expect);
        });

        it('should return pass as false and modules taken if least requirement not met', function () {
            var ele = ['CS1231', 'CS2100', 'CS2030', 'CS2040'];
            var check = ['cs1231', 'cs2106', 'cs2102', 'cs2040'];
            var expect = {
                mod: ['cs1231', 'cs2040'],
                pass: false
            };
            assert.deepStrictEqual(counting.least(ele, check, 3), expect);
        });

        it('should check and return only modules up to the min requirement', function () {
            var ele = ['CS1231', 'CS2106', 'CS2102', 'CS2040'];
            var check = ['cs1231', 'cs2106', 'cs2102', 'cs2040'];
            var expect = {
                mod: ['cs1231', 'cs2106', 'cs2102'],
                pass: true
            };
            assert.deepStrictEqual(counting.least(ele, check, 3), expect);
        });
    });

    describe('Count', function () {
        it('return the number of modules that match between plan and criteria', function () {
            var ele = ['CS1231', 'CS2106', 'CS2102', 'CS2040'];
            var check = ['cs1231', 'cs2106', 'cs2102', 'cs2040'];
            assert.deepStrictEqual(counting.count(ele, check), 4);
        });
    });

    describe('Modin', function () {
        it('return the modules that match between plan and criteria', function () {
            var ele = ['CS1231', 'CS2106', 'CS2102', 'CS2040'];
            var check = ['cs1231', 'cs2105', 'cs2102', 'cs2040'];
            var expect = { mod: ['cs1231', 'cs2102', 'cs2040'] };
            assert.deepStrictEqual(counting.modin(ele, check), expect);
        });
    });

    describe('Elective', function () {
        describe('Business Analytics', function () {
            it('should return pass as true if plan meets business analytics criteria', function () {
                var crit = {
                    "elective": {
                        "lista": ["dba3712", "ie3120", "is3240", "bt4013", "bt4016", "bt4211", "bt4212", "dba4811", "is4241", "is4250", "mkt4812"],
                        "listb": ["bt3017", "ie2110", "cs3244", "dba3803", "bse4711", "bt4012", "bt4015", "bt4221", "bt4222", "bt4240", "is4241", "ie4210", "st3131", "st4245"],
                        "listc": ["is3107", "is3221", "is3261", "bt4014", "is4228", "is4302"]
                    }
                };
                var plan = ['DBA3712', 'IE3120', 'BT3017', 'IE2110', 'IS3107', 'IS3221'];
                var expect = { pass: true };
                assert.deepStrictEqual(counting.elective('business analytics', crit, plan), expect);
            });

            it('should return pass as false and listA as false if plan does not have sufficient listA mods', function () {
                var crit = {
                    "elective": {
                        "lista": ["dba3712", "ie3120", "is3240", "bt4013", "bt4016", "bt4211", "bt4212", "dba4811", "is4241", "is4250", "mkt4812"],
                        "listb": ["bt3017", "ie2110", "cs3244", "dba3803", "bse4711", "bt4012", "bt4015", "bt4221", "bt4222", "bt4240", "is4241", "ie4210", "st3131", "st4245"],
                        "listc": ["is3107", "is3221", "is3261", "bt4014", "is4228", "is4302"]
                    }
                };
                var plan = ['DBA3712', 'BT3017', 'IE2110', 'IS3107', 'IS3221'];
                var expect = {
                    pass: false,
                    lista: { mod: ['dba3712'], pass: false },
                    listb: { mod: ['bt3017', 'ie2110'], pass: true },
                    listc: { mod: ['is3107', 'is3221'] }
                };
                assert.deepStrictEqual(counting.elective('business analytics', crit, plan), expect);
            });

            it('should return pass as false and listB as false if plan does not have sufficient listB mods', function () {
                var crit = {
                    "elective": {
                        "lista": ["dba3712", "ie3120", "is3240", "bt4013", "bt4016", "bt4211", "bt4212", "dba4811", "is4241", "is4250", "mkt4812"],
                        "listb": ["bt3017", "ie2110", "cs3244", "dba3803", "bse4711", "bt4012", "bt4015", "bt4221", "bt4222", "bt4240", "is4241", "ie4210", "st3131", "st4245"],
                        "listc": ["is3107", "is3221", "is3261", "bt4014", "is4228", "is4302"]
                    }
                };
                var plan = ['DBA3712', 'IE3120', 'BT3017', 'IS3107', 'IS3221'];
                var expect = {
                    pass: false,
                    lista: { mod: ['dba3712', 'ie3120'], pass: true },
                    listb: { mod: ['bt3017'], pass: false },
                    listc: { mod: ['is3107', 'is3221'] }
                };
                assert.deepStrictEqual(counting.elective('business analytics', crit, plan), expect);
            });

            it('should return pass as false but listA and listB as true if plan does not have sufficient electives, but sufficient listA and B mods', function () {
                var crit = {
                    "elective": {
                        "lista": ["dba3712", "ie3120", "is3240", "bt4013", "bt4016", "bt4211", "bt4212", "dba4811", "is4241", "is4250", "mkt4812"],
                        "listb": ["bt3017", "ie2110", "cs3244", "dba3803", "bse4711", "bt4012", "bt4015", "bt4221", "bt4222", "bt4240", "is4241", "ie4210", "st3131", "st4245"],
                        "listc": ["is3107", "is3221", "is3261", "bt4014", "is4228", "is4302"]
                    }
                };
                var plan = ['DBA3712', 'IE3120', 'BT3017', 'IE2110', 'IS3107'];
                var expect = {
                    pass: false,
                    lista: { mod: ['dba3712', 'ie3120'], pass: true },
                    listb: { mod: ['bt3017', 'ie2110'], pass: true },
                    listc: { mod: ['is3107'] }
                };
                assert.deepStrictEqual(counting.elective('business analytics', crit, plan), expect);
            });
        });
        describe('Information Systems', function () {
            it('Should return pass as true and mods taken if plans has at least 7 elective mods', function () {
                var crit = {
                    elective: [
                        "is3150", "is3240", "is3261", "is4151", "is4228", "is4302", "is4303", "bt3017", "cs2105", "cs3240",
                        "is3221", "is4100", "is4204", "is4234", "is4243", "is4250", "is3251", "is4152", "is4242", "is4241",
                        "is4261", "is5002", "is5128", "cs2107", "ifs4101", "is4231", "is4233"
                    ]
                };
                var plan = ['IS3150', 'IS3240', 'IS3221', 'IS4100', 'IS4261', 'IS5002', 'IS3261'];
                var expect = {
                    pass: true,
                    mod: ['is3150', 'is3240', 'is3261', 'is3221', 'is4100', 'is4261', 'is5002']
                };
                assert.deepStrictEqual(counting.elective('information systems', crit, plan), expect);
            });

            it('Should return pass as fail and elective mods taken if plans has less than 7 elective mods', function () {
                var crit = {
                    elective: [
                        "is3150", "is3240", "is3261", "is4151", "is4228", "is4302", "is4303", "bt3017", "cs2105", "cs3240",
                        "is3221", "is4100", "is4204", "is4234", "is4243", "is4250", "is3251", "is4152", "is4242", "is4241",
                        "is4261", "is5002", "is5128", "cs2107", "ifs4101", "is4231", "is4233"
                    ]
                };
                var plan = ['IS3150', 'IS3240', 'IS3020', 'IS4100', 'IS4261', 'IS5002', 'IS3261', 'IS1234'];
                var expect = {
                    pass: false,
                    mod: ['is3150', 'is3240', 'is3261', 'is4100', 'is4261', 'is5002']
                };
                assert.deepStrictEqual(counting.elective('information systems', crit, plan), expect);
            });

        });

        describe('Information Security', function () {

            it('should return pass as true if plan has at least 3 elective mods', function () {
                var crit = {
                    elective: [
                        'cs3236', 'cs4236', 'ma4261', 'cs4238', 'cs4239', 'cs4257', 'cs4276', 'cs5231',
                        'cs5321', 'cs5322', 'cs5331', 'cs5332', 'ifs4101', 'ifs4102', 'ifs4103', 'is4204',
                        'is4233', 'is4234', 'is4302'
                    ]
                };
                var plan = ['CS3236', 'CS4236', 'CS4238'];
                var expect = {
                    pass: true,
                    mod: ['cs3236', 'cs4236', 'cs4238']
                };
                assert.deepStrictEqual(counting.elective('information security', crit, plan), expect);
            });

        });
    });
});
