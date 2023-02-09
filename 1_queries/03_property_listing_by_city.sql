SELECT pp.id, pp.title, pp.cost_per_night, AVG(pr.rating) AS average_rating
FROM  properties pp
LEFT JOIN  property_reviews pr ON pp.id = property_id
WHERE city LIKE '%ncouver'
GROUP BY pp.id
HAVING AVG(pr.rating) >= 4
ORDER BY pp.cost_per_night ASC
LIMIT 10;