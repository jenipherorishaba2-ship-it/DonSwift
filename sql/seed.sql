-- TalentLens demo data. Import AFTER schema.sql.
-- Deadlines are relative to today so the dashboard colours always look right.
USE talentlens;

INSERT INTO vacancies (id, title, client, location, positions, deadline, description) VALUES
(1, 'Accounts Assistant', 'Kampala Beverages Distributors Ltd', 'Kampala', 1, DATE_ADD(CURDATE(), INTERVAL 4 DAY),
'We are looking for an Accounts Assistant.
Requirements:
- Must have a Bachelor''s degree in Accounting or Finance; CPA is required.
- Bookkeeping, reconciliation and preparing financial statements is essential.
- Strong Excel skills required.
- Knowledge of VAT and PAYE tax returns.
- Experience with QuickBooks or Sage is an added advantage.
- Minimum 2 years of experience.
- Attention to detail, integrity and honesty.'),
(2, 'Customer Service & Sales Lead', 'SwiftMart Supermarkets', 'Kampala', 2, DATE_ADD(CURDATE(), INTERVAL 9 DAY),
'SwiftMart is hiring a Customer Service & Sales Lead for our Ntinda branch.
Key requirements:
- Excellent customer service and communication skills are essential.
- Proven sales ability and meeting targets is required.
- Must be confident with cash handling and mobile money payments.
- Able to negotiate with suppliers and customers.
- Stock control and inventory checks.
- Lead and supervise a team of 4 cashiers.
- Speaks Luganda and English. Swahili is an added advantage.
- Diploma preferred. Must be reliable, honest and customer-focused.'),
(3, 'Warehouse & Logistics Supervisor', 'Donswift Logistics Client - AgroHub', 'Mukono', 1, DATE_ADD(CURDATE(), INTERVAL 21 DAY),
'AgroHub needs a Warehouse & Logistics Supervisor.
Requirements:
- Stock control and inventory management is required.
- Must plan deliveries, dispatch and scheduling of drivers.
- Supervise a team of loaders.
- Basic computer skills and record keeping.
- Health and safety awareness, first aid is an advantage.
- Valid driving permit preferred.
- Problem solving and time management. Must show initiative.');

INSERT INTO candidates (id, full_name, gender, age, school, education, years_experience, phone, channel, profile_text) VALUES
(1, 'Amina Nakato', 'Female', 24, 'Kawempe Muslim SS', 'UACE (S.6)', 4, '0772000111', 'whatsapp',
'I did not go to university. For 4 years I ran my mother''s market stall in Owino market selling clothes and shoes. I handled all the money every day, cash and mobile money, and I kept a notebook of what we sold and what we had left. I bargain with suppliers from Kikuubo every week to get better prices. Customers come back to us because I treat them well. I am treasurer of our women savings group (VSLA). I sing in the church choir. I speak Luganda, English and some Swahili.'),
(2, 'Brian Ssemwogerere', 'Male', 27, 'Makerere University', 'Bachelor of Commerce', 3, '0701222333', 'web',
'Curriculum Vitae. Bachelor of Commerce, Makerere University. Professional summary: dynamic, results-oriented graduate with strong communication skills and a passion for excellence. Experience: Sales intern at Airtel Uganda (6 months), customer care desk at Stanbic Bank (2 years). Skills: customer service, sales, Microsoft Office, Excel, teamwork, communication, presentation. Hobbies: reading, travelling.'),
(3, 'Grace Atim', 'Female', 29, 'MUBS', 'Bachelor of Accounting, CPA(U)', 5, '0782444555', 'web',
'Certified Public Accountant (CPA Uganda). 5 years experience in accounting and bookkeeping at a mid-size audit firm. Prepared financial statements, bank reconciliation, VAT and PAYE returns with URA. Advanced Excel and QuickBooks. Attention to detail and integrity. Supervised two junior accounts clerks.'),
(4, 'Joseph Okello', 'Male', 31, 'Lira Town College', 'Certificate in Logistics', 6, '0753666777', 'ussd',
'Worked as a boda boda rider for 3 years then as store keeper at a hardware shop for 3 years. I received stock, counted inventory and dispatched deliveries to customers. I organised the delivery schedule for 3 other riders. I have a driving permit class B. First aid trained by Red Cross. I solve problems quickly when deliveries go wrong.'),
(5, 'Patience Namuli', 'Female', 23, 'Kyambogo University', 'Diploma in Business Administration', 1, '0774888999', 'web',
'Diploma in Business Administration. One year as a cashier at a supermarket handling cash and till reconciliation. Good customer care and communication. I post promotions on Facebook and TikTok for the shop. Team player, punctual. Speak English and Luganda.'),
(6, 'David Mugisha', 'Male', 26, 'Uganda Christian University', 'Bachelor of Science in Accounting', 2, '0705111222', 'web',
'BSc Accounting. 2 years accounts assistant: bookkeeping, ledger posting, reconciliations, Excel, Sage. Currently pursuing CPA. Prepared VAT schedules. Detail-oriented and honest.'),
(7, 'Sarah Achieng', 'Female', 25, 'Busitema University', 'Bachelor of Agriculture', 1, '0789333444', 'web',
'Bachelor of Agriculture. Managed my family poultry farm of 2,000 birds: planned feeding timetable, tracked feed stock, sold eggs to hotels and negotiated prices. Youth leader at church, coordinated a team of volunteers for events. Basic computer and record keeping.'),
(8, 'Kenneth Tumwine', 'Male', 22, 'St Mary''s College Kisubi', 'UACE (S.6)', 2, '0756777888', 'whatsapp',
'Mobile money agent for 2 years in Wandegeya, served about 100 customers a day and kept accurate records. Football team captain. I want a job where I can grow.');

-- Inclusion demo: a Deaf candidate who applies by text/video and needs a sign language interpreter
INSERT INTO candidates (id, full_name, gender, age, school, education, years_experience, phone, channel, accommodations, comm_pref, profile_text) VALUES
(9, 'Ruth Akello', 'Female', 27, 'Uganda School for the Deaf, Ntinda', 'UCE (S.4), Certificate in Computer Applications', 3, '0700123456', 'video-sign',
'Deaf / hard of hearing: Ugandan Sign Language interpreter at interview; Contact by text/WhatsApp only', 'Text / WhatsApp',
'I am Deaf and I use Ugandan Sign Language. For 3 years I have been treasurer of our Deaf women savings group (VSLA) with 40 members. I record every contribution and loan in Excel and I have never had a missing shilling. I also did data entry for a printing shop. I am very careful and accurate with numbers.');

INSERT INTO applications (candidate_id, vacancy_id, source, status) VALUES
(1, 1, 'applied', 'Screening'),
(2, 2, 'applied', 'Screening'),
(3, 1, 'applied', 'Screening'),
(4, 3, 'applied', 'Screening'),
(5, 2, 'applied', 'Received'),
(6, 1, 'applied', 'Screening'),
(7, 1, 'applied', 'Received'),
(8, 2, 'applied', 'Received'),
(9, 1, 'applied', 'Screening');

-- Proof-of-skill challenge results (0-100)
INSERT INTO challenge_results (candidate_id, vacancy_id, score) VALUES
(1, 1, 52),
(1, 2, 92),
(2, 2, 61),
(3, 1, 88),
(4, 3, 85),
(5, 2, 74),
(6, 1, 70),
(7, 3, 81),
(9, 1, 90);
