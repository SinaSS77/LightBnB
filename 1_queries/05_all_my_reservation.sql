SELECT  
          re.id, 
          pp.title, 
          pp.cost_per_night,
          re.start_date,
          AVG(rating) as average_rating
FROM      reservations     re
JOIN      properties       pp    ON re.property_id = pp.id
JOIN      property_reviews pr    ON pp.id = pr.property_id 
WHERE     re.guest_id = 1
GROUP BY  pp.id, re.id
ORDER BY  re.start_date
LIMIT 10;


