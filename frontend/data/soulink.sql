--
-- PostgreSQL database cluster dump
--

-- Started on 2026-01-15 21:30:54

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE cloud_admin;
ALTER ROLE cloud_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE neon_service;
ALTER ROLE neon_service WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE neon_superuser;
ALTER ROLE neon_superuser WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION BYPASSRLS;
CREATE ROLE neondb_owner;
ALTER ROLE neondb_owner WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--


--
-- Role memberships
--

GRANT neon_superuser TO neon_service WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT neon_superuser TO neondb_owner WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_create_subscription TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_monitor TO neon_superuser WITH ADMIN OPTION, INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_read_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_signal_backend TO neon_superuser WITH ADMIN OPTION, INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_write_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.7 (e429a59)
-- Dumped by pg_dump version 17.0

-- Started on 2026-01-15 21:30:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-01-15 21:30:59

--
-- PostgreSQL database dump complete
--

--
-- Database "soulink" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.7 (e429a59)
-- Dumped by pg_dump version 17.0

-- Started on 2026-01-15 21:31:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3437 (class 1262 OID 16487)
-- Name: soulink; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE soulink WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


ALTER DATABASE soulink OWNER TO neondb_owner;

\connect soulink

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 40968)
-- Name: articulos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.articulos (
    id_articulo integer NOT NULL,
    titulo character varying(150) NOT NULL,
    contenido text NOT NULL,
    fecha_publicacion date NOT NULL,
    id_rol integer NOT NULL
);


ALTER TABLE public.articulos OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 40967)
-- Name: articulos_id_articulo_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.articulos_id_articulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articulos_id_articulo_seq OWNER TO neondb_owner;

--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 223
-- Name: articulos_id_articulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.articulos_id_articulo_seq OWNED BY public.articulos.id_articulo;


--
-- TOC entry 220 (class 1259 OID 24577)
-- Name: clientes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.clientes (
    id_cliente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(20),
    id_rol integer NOT NULL
);


ALTER TABLE public.clientes OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 24576)
-- Name: clientes_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.clientes_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_cliente_seq OWNER TO neondb_owner;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 219
-- Name: clientes_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.clientes_id_cliente_seq OWNED BY public.clientes.id_cliente;


--
-- TOC entry 228 (class 1259 OID 40994)
-- Name: compras; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.compras (
    id_compra integer NOT NULL,
    id_venta integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL
);


ALTER TABLE public.compras OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 40993)
-- Name: compras_id_compra_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.compras_id_compra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compras_id_compra_seq OWNER TO neondb_owner;

--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 227
-- Name: compras_id_compra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.compras_id_compra_seq OWNED BY public.compras.id_compra;


--
-- TOC entry 222 (class 1259 OID 40961)
-- Name: productos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.productos (
    id_producto integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    precio numeric(10,2) NOT NULL,
    stock integer NOT NULL
);


ALTER TABLE public.productos OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 40960)
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_producto_seq OWNER TO neondb_owner;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 221
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 218 (class 1259 OID 16509)
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- TOC entry 217 (class 1259 OID 16508)
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_rol_seq OWNER TO neondb_owner;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.roles_id_rol_seq OWNED BY public.roles.id_rol;


--
-- TOC entry 230 (class 1259 OID 65559)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    id_rol integer
);


ALTER TABLE public.usuarios OWNER TO neondb_owner;

--
-- TOC entry 229 (class 1259 OID 65558)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO neondb_owner;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 226 (class 1259 OID 40982)
-- Name: ventas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ventas (
    id_venta integer NOT NULL,
    fecha_venta date NOT NULL,
    id_cliente integer NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.ventas OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 40981)
-- Name: ventas_id_venta_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ventas_id_venta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_venta_seq OWNER TO neondb_owner;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 225
-- Name: ventas_id_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ventas_id_venta_seq OWNED BY public.ventas.id_venta;


--
-- TOC entry 3243 (class 2604 OID 40971)
-- Name: articulos id_articulo; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articulos ALTER COLUMN id_articulo SET DEFAULT nextval('public.articulos_id_articulo_seq'::regclass);


--
-- TOC entry 3241 (class 2604 OID 24580)
-- Name: clientes id_cliente; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_cliente_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 40997)
-- Name: compras id_compra; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.compras ALTER COLUMN id_compra SET DEFAULT nextval('public.compras_id_compra_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 40964)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 16512)
-- Name: roles id_rol; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_rol SET DEFAULT nextval('public.roles_id_rol_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 65562)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 40985)
-- Name: ventas id_venta; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id_venta SET DEFAULT nextval('public.ventas_id_venta_seq'::regclass);


--
-- TOC entry 3425 (class 0 OID 40968)
-- Dependencies: 224
-- Data for Name: articulos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.articulos (id_articulo, titulo, contenido, fecha_publicacion, id_rol) FROM stdin;
1	5 maneras de meditar	Contenido sobre meditación...	2025-01-01	2
2	Cómo reducir el estrés	Artículo sobre estrés...	2025-01-05	2
3	Mindfulness diario	Guía de mindfulness...	2025-01-10	2
4	Respiración consciente	Ejercicios de respiración...	2025-01-15	2
5	Equilibrio mental	Claves para el equilibrio...	2025-01-20	1
\.


--
-- TOC entry 3421 (class 0 OID 24577)
-- Dependencies: 220
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.clientes (id_cliente, nombre, email, telefono, id_rol) FROM stdin;
2	María López	maria@mail.com	222222222	3
3	Pedro Soto	pedro@mail.com	333333333	3
5	Luis Díaz	luis@mail.com	555555555	3
1	Juan Pérez	juan@mail.com	111111111	3
4	Ana Torres	ana@ejemplo.com	444444444	3
\.


--
-- TOC entry 3429 (class 0 OID 40994)
-- Dependencies: 228
-- Data for Name: compras; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.compras (id_compra, id_venta, id_producto, cantidad) FROM stdin;
1	1	1	1
2	1	2	1
3	2	1	1
4	3	4	1
5	4	3	1
\.


--
-- TOC entry 3423 (class 0 OID 40961)
-- Dependencies: 222
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.productos (id_producto, nombre, descripcion, precio, stock) FROM stdin;
1	Polera Soulink	Polera oficial Soulink	14990.00	50
2	Taza Soulink	Taza con logo Soulink	8990.00	30
3	Gorro Soulink	Gorro invierno Soulink	12990.00	20
4	Sticker Pack	Pack de stickers Soulink	3990.00	100
5	Cuaderno Zen	Cuaderno de meditación	6990.00	40
\.


--
-- TOC entry 3419 (class 0 OID 16509)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id_rol, nombre_rol) FROM stdin;
1	ADMIN
2	PSICOLOGO
3	CLIENTE
\.


--
-- TOC entry 3431 (class 0 OID 65559)
-- Dependencies: 230
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.usuarios (id_usuario, nombre, email, password, id_rol) FROM stdin;
1	Admin	admin@soulink.com	admin123	1
2	RyuZeNK	ryu@soulink.com	miClave123	2
3	Anna	anna@ejemplo.com	12345678	2
10	Kevin SotoMayor	kevinS@example.com	Password123	3
\.


--
-- TOC entry 3427 (class 0 OID 40982)
-- Dependencies: 226
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ventas (id_venta, fecha_venta, id_cliente, total) FROM stdin;
1	2025-02-01	1	23980.00
2	2025-02-02	2	14990.00
3	2025-02-03	3	3990.00
4	2025-02-04	4	18980.00
5	2025-02-05	5	6990.00
\.


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 223
-- Name: articulos_id_articulo_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.articulos_id_articulo_seq', 5, true);


--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 219
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 10, true);


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 227
-- Name: compras_id_compra_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.compras_id_compra_seq', 5, true);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 221
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 5, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 3, true);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 11, true);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 225
-- Name: ventas_id_venta_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ventas_id_venta_seq', 5, true);


--
-- TOC entry 3258 (class 2606 OID 40975)
-- Name: articulos articulos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articulos
    ADD CONSTRAINT articulos_pkey PRIMARY KEY (id_articulo);


--
-- TOC entry 3252 (class 2606 OID 24584)
-- Name: clientes clientes_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_email_key UNIQUE (email);


--
-- TOC entry 3254 (class 2606 OID 24582)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 3262 (class 2606 OID 40999)
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id_compra);


--
-- TOC entry 3256 (class 2606 OID 40966)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 3248 (class 2606 OID 16516)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 3250 (class 2606 OID 16514)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 3264 (class 2606 OID 65568)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3266 (class 2606 OID 65566)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 3260 (class 2606 OID 40987)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id_venta);


--
-- TOC entry 3268 (class 2606 OID 40976)
-- Name: articulos articulos_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articulos
    ADD CONSTRAINT articulos_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);


--
-- TOC entry 3267 (class 2606 OID 24585)
-- Name: clientes clientes_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);


--
-- TOC entry 3270 (class 2606 OID 41005)
-- Name: compras compras_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 3271 (class 2606 OID 41000)
-- Name: compras compras_id_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_id_venta_fkey FOREIGN KEY (id_venta) REFERENCES public.ventas(id_venta);


--
-- TOC entry 3272 (class 2606 OID 65569)
-- Name: usuarios usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);


--
-- TOC entry 3269 (class 2606 OID 40988)
-- Name: ventas ventas_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id_cliente);


--
-- TOC entry 2075 (class 826 OID 49153)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2074 (class 826 OID 49152)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2026-01-15 21:31:05

--
-- PostgreSQL database dump complete
--

-- Completed on 2026-01-15 21:31:05

--
-- PostgreSQL database cluster dump complete
--

