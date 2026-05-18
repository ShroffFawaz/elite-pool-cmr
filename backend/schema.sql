
create type user_role as enum ('ceo', 'partner', 'admin', 'customer_support');
create type lead_status as enum ('new', 'contacted', 'site_visit', 'negotiation', 'won', 'lost');
create type lead_source as enum ('meta_ad', 'google_ad', 'referral', 'walk_in', 'other');


create table users(
	id 					serial 			primary key,
	username 			varchar(50) 	unique not null,
	full_name 			varchar(100),
	email 				varchar(255) 	unique not null,
	hashed_password 	text 			not null,
	disabled 			boolean 		default FALSE,
	role 				user_role 		default 'customer_support',
	created_at 			timestamp 		default now(),
	last_login 			timestamp
);

create table construction_leads (
    id          serial          primary key,
    lead_code   varchar(50)     unique not null,
    name        varchar(100)    not null,
    phone       varchar(20)     not null,
    location    varchar(255),
    requirement text,
    status      lead_status     default 'new',
    source      lead_source     default 'meta_ad',
    created_at  timestamp       default now()
);

INSERT INTO users (username, full_name, email, hashed_password, disabled, role)
VALUES (
    'Fezi',
    'Shroff Fawaz',
    'shrofffawazpasha@gmail.com',
    '$2b$12$JFD5E9/vFhqTnFGbr7lHCeUwNwk4zczysxP1.4JRpbmzfCZxqvVMG',
    FALSE,
    'ceo'
);






