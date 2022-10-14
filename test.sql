SELECT dayid, days.name,
    COUNT(appoinments.*) AS appointments,
    COUNT(interview.*) as interviews
    FROM appoinments
    JOIN days ON days.id = appoinments.dayid
    LEFT JOIN interview ON appoinments.id = interview.appointments_id
    GROUP BY dayid, days.name
    ORDER BY dayid;