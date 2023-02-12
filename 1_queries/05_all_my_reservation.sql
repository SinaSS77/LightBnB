--Instruction
-- Show all reservations for a user.

-- Select the reservation id, property title, reservation start_date, property cost_per_night and the average rating of the property. You'll need data from both the reservations and properties tables.
-- The reservations will be for a single user, so just use 1 for the user_id.
-- Order the results from the earliest start_date to the most recent start_date.
-- Limit the results to 10.

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


