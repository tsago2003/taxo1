"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = getRecommendations;
exports.getSimilarProducts = getSimilarProducts;
const db_1 = require("./db");
/**
 * Hybrid recommendation engine — content affinity (category + brand + price)
 * blended with popularity and recency, with a cold-start fallback to trending.
 * Signals: purchase = 3, wishlist = 2, view = 1.
 */
async function getRecommendations(userId, limit = 8) {
    const categoryWeight = {};
    const brandWeight = {};
    let priceSum = 0;
    let priceCount = 0;
    function addAffinity(rows, weight) {
        for (const row of rows) {
            if (row.category) {
                categoryWeight[row.category] = (categoryWeight[row.category] || 0) + weight;
            }
            if (row.brand) {
                brandWeight[row.brand] = (brandWeight[row.brand] || 0) + weight;
            }
            priceSum += row.price * weight;
            priceCount += weight;
        }
    }
    const [views, wishlist, purchases] = await Promise.all([
        (0, db_1.query)(`SELECT p.category, p.brand, p.price
       FROM product_views v JOIN products p ON p.id = v.product_id
       WHERE v.user_id = $1`, [userId]),
        (0, db_1.query)(`SELECT p.category, p.brand, p.price
       FROM wishlists w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = $1`, [userId]),
        (0, db_1.query)(`SELECT p.category, p.brand, p.price
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1`, [userId]),
    ]);
    addAffinity(views, 1);
    addAffinity(wishlist, 2);
    addAffinity(purchases, 3);
    const preferredPrice = priceCount > 0 ? priceSum / priceCount : null;
    const hasSignals = priceCount > 0;
    const candidates = await (0, db_1.query)(`SELECT p.*, u.shop_name,
       (SELECT count(*)::int FROM product_views v WHERE v.product_id = p.id) AS views_count,
       (SELECT count(*)::int FROM order_items oi WHERE oi.product_id = p.id) AS orders_count
     FROM products p
     JOIN users u ON u.id = p.user_id
     WHERE p.is_sold = false AND p.user_id != $1`, [userId]);
    const now = Date.now();
    const scored = candidates.map((product) => {
        let score = 0;
        if (hasSignals) {
            score += (categoryWeight[product.category] || 0) * 1.0;
            if (product.brand)
                score += (brandWeight[product.brand] || 0) * 0.5;
            if (preferredPrice && preferredPrice > 0) {
                const ratio = Math.abs(product.price - preferredPrice) / preferredPrice;
                if (ratio < 0.3)
                    score += 1.5;
                else if (ratio < 0.6)
                    score += 0.75;
            }
        }
        else {
            score += Math.log(1 + product.views_count + 3 * product.orders_count) * 2;
        }
        score += Math.log(1 + product.views_count + 3 * product.orders_count) * 0.5;
        const ageDays = (now - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 0.5 - ageDays / 60);
        return { product, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((entry) => entry.product);
}
async function getSimilarProducts(productId, limit = 4) {
    const source = await (0, db_1.query)("SELECT category, brand, price FROM products WHERE id = $1", [productId]);
    if (source.length === 0)
        return [];
    const s = source[0];
    return (0, db_1.query)(`SELECT p.*, u.shop_name
     FROM products p
     JOIN users u ON u.id = p.user_id
     WHERE p.id != $1 AND p.is_sold = false
     ORDER BY
       (p.category = $2) DESC,
       (COALESCE(p.brand, '') = COALESCE($3, '')) DESC,
       abs(p.price - $4) ASC,
       p.created_at DESC
     LIMIT $5`, [productId, s.category, s.brand, s.price, limit]);
}
//# sourceMappingURL=recommendations.js.map