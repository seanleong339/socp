const express = require("express");

const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.get != null) {
        console.log(req.cookies);
        res.json(req.cookies);
    }
    else {
        const rep = JSON.stringify({
            "major": null,
            "specialisation": null,
            "y1s1": ["cs2100", "cs1231s"],
            "y1s2": [null],
            "y2s1": [null],
            "y2s2": [null],
            "y3s1": [null],
            "y3s2": [null],
            "y4s1": [null],
            "y4s2": [null],
        });
        res.cookie(rep);
        res.json(rep)
        res.end();
    }
});

module.exports = router;