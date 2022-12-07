-- Your SQL goes here
create table accounts (
	id varchar not null primary key,
	secret_key varchar not null,
	account_name varchar not null,
	issuer varchar not null,
	sort integer not null,
	created_at varchar not null,
	updated_at varchar not null
);