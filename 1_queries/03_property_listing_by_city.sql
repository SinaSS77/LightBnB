-- When the users come to our home page, they are going to see a list of properties. They will be able to view the properties and filter them by location. They will be able to see all data about the property, including the average rating.

-- Note
-- Although users will need to see a lot of data from the properties table on the website, for now, we're going to build this query by selecting just a few columns. That way it's easy to see in the terminal. Later we'll use this query in our app and alter it slightly to select more columns.

-- Instruction
-- Show specific details about properties located in Vancouver including their average rating.

-- Select the id, title, cost_per_night, and an average_rating from the properties table for properties located in Vancouver.
-- Order the results from lowest cost_per_night to highest cost_per_night.
-- Limit the number of results to 10.
-- Only show listings that have a rating >= 4 stars.

SELECT pp.id, pp.title, pp.cost_per_night, AVG(pr.rating) AS average_rating
FROM  properties pp
LEFT JOIN  property_reviews pr ON pp.id = property_id
WHERE city LIKE '%ncouver'
GROUP BY pp.id
HAVING AVG(pr.rating) >= 4
ORDER BY pp.cost_per_night ASC
LIMIT 10;