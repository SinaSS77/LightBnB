SELECT pp.city, COUNT(re.property_id) as total_reservations
FROM  properties pp
JOIN  reservations re ON pp.id = property_id
GROUP BY pp.city
ORDER BY total_reservations DESC;