-- =========================================================
-- Cloud Market - schema inicial
-- =========================================================

CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(120)  NOT NULL,
    email          VARCHAR(180)  NOT NULL UNIQUE,
    password_hash  VARCHAR(100)  NOT NULL,
    role           VARCHAR(20)   NOT NULL DEFAULT 'BUYER',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(80)  NOT NULL,
    slug  VARCHAR(80)  NOT NULL UNIQUE,
    icon  VARCHAR(20)
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200)   NOT NULL,
    description     VARCHAR(4000),
    price           NUMERIC(12, 2) NOT NULL,
    original_price  NUMERIC(12, 2),
    stock           INTEGER        NOT NULL DEFAULT 0,
    image_url       VARCHAR(500),
    item_condition  VARCHAR(10)    NOT NULL DEFAULT 'NEW',
    free_shipping   BOOLEAN        NOT NULL DEFAULT FALSE,
    sold_count      INTEGER        NOT NULL DEFAULT 0,
    rating          NUMERIC(2, 1),
    category_id     BIGINT         NOT NULL REFERENCES categories (id),
    seller_id       BIGINT         NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_title ON products (lower(title));

CREATE TABLE orders (
    id                 BIGSERIAL PRIMARY KEY,
    buyer_id           BIGINT         NOT NULL REFERENCES users (id),
    status             VARCHAR(30)    NOT NULL,
    total              NUMERIC(12, 2) NOT NULL,
    payment_provider   VARCHAR(30),
    payment_reference  VARCHAR(120),
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_buyer ON orders (buyer_id);

CREATE TABLE order_items (
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT         NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id     BIGINT         NOT NULL REFERENCES products (id),
    product_title  VARCHAR(200)   NOT NULL,
    image_url      VARCHAR(500),
    unit_price     NUMERIC(12, 2) NOT NULL,
    quantity       INTEGER        NOT NULL
);

-- =========================================================
-- Spring Session JDBC (sessão do BFF persistida no Postgres,
-- sobrevive ao "sleep" do plano gratuito do Render)
-- =========================================================
CREATE TABLE spring_session (
    primary_id            CHAR(36)     NOT NULL,
    session_id            CHAR(36)     NOT NULL,
    creation_time         BIGINT       NOT NULL,
    last_access_time      BIGINT       NOT NULL,
    max_inactive_interval INT          NOT NULL,
    expiry_time           BIGINT       NOT NULL,
    principal_name        VARCHAR(100),
    CONSTRAINT spring_session_pk PRIMARY KEY (primary_id)
);

CREATE UNIQUE INDEX spring_session_ix1 ON spring_session (session_id);
CREATE INDEX spring_session_ix2 ON spring_session (expiry_time);
CREATE INDEX spring_session_ix3 ON spring_session (principal_name);

CREATE TABLE spring_session_attributes (
    session_primary_id CHAR(36)     NOT NULL,
    attribute_name     VARCHAR(200) NOT NULL,
    attribute_bytes    BYTEA        NOT NULL,
    CONSTRAINT spring_session_attributes_pk PRIMARY KEY (session_primary_id, attribute_name),
    CONSTRAINT spring_session_attributes_fk FOREIGN KEY (session_primary_id)
        REFERENCES spring_session (primary_id) ON DELETE CASCADE
);
