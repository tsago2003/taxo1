"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const recommendations_1 = require("../recommendations");
const router = (0, express_1.Router)();
router.get("/", middleware_1.requireBuyer, async (req, res) => {
    const recs = await (0, recommendations_1.getRecommendations)(req.user.userId, 8);
    res.json(recs);
});
exports.default = router;
//# sourceMappingURL=recommendations.js.map