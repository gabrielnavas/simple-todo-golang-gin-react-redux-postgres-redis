CREATE TABLE public.users (
	id uuid NOT NULL,
	email varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	created_at timestamp with time zone NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz,
	CONSTRAINT users_unique_username UNIQUE (email),
	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE TABLE public.tasks (
	id uuid NOT NULL,
	description varchar(500) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz,
	id_users uuid NOT NULL,
	CONSTRAINT task_pk PRIMARY KEY (id),
	CONSTRAINT users_fk FOREIGN KEY (id_users) REFERENCES public.users (id) 
);
