CREATE SCHEMA IF NOT EXISTS main;

CREATE TABLE main.product (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	name                 varchar(100)  NOT NULL ,
	description          varchar(100),
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	created_by           uuid   ,
	modified_by          uuid   ,
	deleted              bool DEFAULT false NOT NULL ,
	deleted_by           uuid   ,
	deleted_on           timestamptz   ,
	CONSTRAINT pk_product_id PRIMARY KEY ( id )
 );


CREATE TABLE IF NOT EXISTS main.archive_mapping (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	key                  text  NOT NULL ,
	acted_on             text  NOT NULL ,
	filter               text,
	actor                text,
	acted_at						 timestamptz NOT NULL,
	CONSTRAINT pk_archive_mapping_id PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS main.job_details (
		id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
		status               text NOT NULL ,
		filter_inquired							 jsonb ,
		entity 							 text ,
		result							 text,
		created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	created_by           uuid   ,
	modified_by          uuid   ,
	deleted              bool DEFAULT false NOT NULL ,
	deleted_by           uuid   ,
	deleted_on           timestamptz   ,
		CONSTRAINT pk_job_details_id PRIMARY KEY ( id )
);
