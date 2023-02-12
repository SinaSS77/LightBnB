-- Most Visited Cities
-- Our product managers want a query to see a list of the most visited cities.

-- Instruction
-- Get a list of the most visited cities.

-- Select the name of the city and the number of reservations for that city.
-- Order the results from highest number of reservations to lowest number of reservations.

SELECT pp.city, COUNT(re.property_id) as total_reservations
FROM  properties pp
JOIN  reservations re ON pp.id = property_id
GROUP BY pp.city
ORDER BY total_reservations DESC;