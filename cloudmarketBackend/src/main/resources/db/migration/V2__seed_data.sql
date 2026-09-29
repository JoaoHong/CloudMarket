-- Dados de exemplo para demonstração
-- Vendedores de exemplo (sem login: hash inválido de propósito)
INSERT INTO users (name, email, password_hash, role) VALUES
    ('Loja Oficial Nuvem Tech', 'tech@cloudmarket.dev', '!login-disabled', 'SELLER'),
    ('Casa & Cia Store', 'casa@cloudmarket.dev', '!login-disabled', 'SELLER'),
    ('Esporte Total', 'esporte@cloudmarket.dev', '!login-disabled', 'SELLER');

INSERT INTO categories (name, slug, icon) VALUES
    ('Celulares e Telefones', 'celulares', '📱'),
    ('Informática', 'informatica', '💻'),
    ('Eletrodomésticos', 'eletrodomesticos', '🏠'),
    ('Games', 'games', '🎮'),
    ('Esportes e Fitness', 'esportes', '⚽'),
    ('Moda', 'moda', '👕'),
    ('Casa e Móveis', 'casa-moveis', '🛋️'),
    ('Livros', 'livros', '📚');

INSERT INTO products (title, description, price, original_price, stock, image_url, item_condition, free_shipping, sold_count, rating, category_id, seller_id) VALUES
    ('Smartphone Nebula X 128GB 6GB RAM Tela 6.5"', 'Smartphone com tela AMOLED de 6.5 polegadas, câmera tripla de 50MP e bateria de 5000mAh.', 1299.90, 1599.90, 40, 'https://picsum.photos/seed/cloudmarket-1/600/600', 'NEW', TRUE, 1532, 4.7, (SELECT id FROM categories WHERE slug = 'celulares'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Smartphone Stratus Lite 64GB', 'Modelo de entrada com ótima autonomia de bateria e dual chip.', 749.00, NULL, 80, 'https://picsum.photos/seed/cloudmarket-2/600/600', 'NEW', TRUE, 864, 4.4, (SELECT id FROM categories WHERE slug = 'celulares'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Fone de Ouvido Bluetooth Cumulus Pro com Cancelamento de Ruído', 'Até 30h de bateria, cancelamento ativo de ruído e estojo de carregamento.', 349.90, 499.90, 120, 'https://picsum.photos/seed/cloudmarket-3/600/600', 'NEW', TRUE, 2210, 4.6, (SELECT id FROM categories WHERE slug = 'celulares'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Carregador Turbo USB-C 33W', 'Carregador rápido compatível com os principais smartphones.', 79.90, NULL, 300, 'https://picsum.photos/seed/cloudmarket-4/600/600', 'NEW', FALSE, 4120, 4.8, (SELECT id FROM categories WHERE slug = 'celulares'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Notebook Cirrus 15 Core i5 16GB SSD 512GB', 'Notebook leve para trabalho e estudo, tela Full HD de 15.6".', 3899.00, 4499.00, 15, 'https://picsum.photos/seed/cloudmarket-5/600/600', 'NEW', TRUE, 410, 4.7, (SELECT id FROM categories WHERE slug = 'informatica'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Monitor 27" QHD 165Hz', 'Monitor gamer IPS com 1ms de tempo de resposta.', 1499.90, 1799.90, 25, 'https://picsum.photos/seed/cloudmarket-6/600/600', 'NEW', TRUE, 322, 4.8, (SELECT id FROM categories WHERE slug = 'informatica'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Teclado Mecânico RGB Switch Blue', 'Teclado ABNT2 com iluminação RGB e switches mecânicos.', 219.90, 279.90, 60, 'https://picsum.photos/seed/cloudmarket-7/600/600', 'NEW', FALSE, 1780, 4.5, (SELECT id FROM categories WHERE slug = 'informatica'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Mouse Sem Fio Ergonômico', 'Mouse silencioso com 6 botões e bateria recarregável.', 89.90, NULL, 150, 'https://picsum.photos/seed/cloudmarket-8/600/600', 'NEW', FALSE, 2650, 4.6, (SELECT id FROM categories WHERE slug = 'informatica'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Air Fryer 5L Digital', 'Fritadeira elétrica sem óleo com painel digital e 8 funções.', 399.90, 549.90, 50, 'https://picsum.photos/seed/cloudmarket-9/600/600', 'NEW', TRUE, 5320, 4.8, (SELECT id FROM categories WHERE slug = 'eletrodomesticos'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Liquidificador Turbo 1200W', 'Copo de 3L com 12 velocidades e função pulsar.', 189.90, NULL, 70, 'https://picsum.photos/seed/cloudmarket-10/600/600', 'NEW', FALSE, 1430, 4.5, (SELECT id FROM categories WHERE slug = 'eletrodomesticos'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Cafeteira Expresso 20 Bar', 'Prepare expressos e cappuccinos em casa.', 649.00, 799.00, 20, 'https://picsum.photos/seed/cloudmarket-11/600/600', 'NEW', TRUE, 640, 4.6, (SELECT id FROM categories WHERE slug = 'eletrodomesticos'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Console Portátil Aurora 512GB', 'Console portátil com tela OLED de 7" e 512GB.', 2899.00, 3199.00, 10, 'https://picsum.photos/seed/cloudmarket-12/600/600', 'NEW', TRUE, 288, 4.9, (SELECT id FROM categories WHERE slug = 'games'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Controle Sem Fio para PC e Console', 'Controle com vibração e bateria de longa duração.', 249.90, 299.90, 90, 'https://picsum.photos/seed/cloudmarket-13/600/600', 'NEW', TRUE, 1960, 4.7, (SELECT id FROM categories WHERE slug = 'games'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Headset Gamer 7.1 Surround', 'Headset com microfone removível e som surround virtual.', 199.90, NULL, 45, 'https://picsum.photos/seed/cloudmarket-14/600/600', 'NEW', FALSE, 870, 4.4, (SELECT id FROM categories WHERE slug = 'games'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Console Retrô Usado - Ótimo Estado', 'Console clássico com 2 controles, revisado.', 450.00, NULL, 1, 'https://picsum.photos/seed/cloudmarket-15/600/600', 'USED', FALSE, 12, 4.2, (SELECT id FROM categories WHERE slug = 'games'), (SELECT id FROM users WHERE email = 'tech@cloudmarket.dev')),
    ('Bicicleta Aro 29 21 Marchas', 'Quadro em alumínio, freio a disco e suspensão dianteira.', 1299.00, 1590.00, 12, 'https://picsum.photos/seed/cloudmarket-16/600/600', 'NEW', TRUE, 215, 4.6, (SELECT id FROM categories WHERE slug = 'esportes'), (SELECT id FROM users WHERE email = 'esporte@cloudmarket.dev')),
    ('Kit Halteres Ajustáveis 20kg', 'Par de halteres com anilhas e barras cromadas.', 229.90, NULL, 35, 'https://picsum.photos/seed/cloudmarket-17/600/600', 'NEW', FALSE, 780, 4.7, (SELECT id FROM categories WHERE slug = 'esportes'), (SELECT id FROM users WHERE email = 'esporte@cloudmarket.dev')),
    ('Tênis de Corrida Vento Leve', 'Tênis com amortecimento responsivo para treinos diários.', 279.90, 359.90, 100, 'https://picsum.photos/seed/cloudmarket-18/600/600', 'NEW', TRUE, 1340, 4.5, (SELECT id FROM categories WHERE slug = 'esportes'), (SELECT id FROM users WHERE email = 'esporte@cloudmarket.dev')),
    ('Tapete de Yoga Antiderrapante', 'Tapete de 6mm com alça para transporte.', 69.90, NULL, 200, 'https://picsum.photos/seed/cloudmarket-19/600/600', 'NEW', FALSE, 2890, 4.8, (SELECT id FROM categories WHERE slug = 'esportes'), (SELECT id FROM users WHERE email = 'esporte@cloudmarket.dev')),
    ('Camiseta Básica Algodão Pack com 3', 'Kit com 3 camisetas 100% algodão.', 99.90, 139.90, 150, 'https://picsum.photos/seed/cloudmarket-20/600/600', 'NEW', TRUE, 3450, 4.6, (SELECT id FROM categories WHERE slug = 'moda'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Jaqueta Corta-Vento Impermeável', 'Leve, dobrável e com capuz embutido.', 179.90, NULL, 40, 'https://picsum.photos/seed/cloudmarket-21/600/600', 'NEW', FALSE, 520, 4.5, (SELECT id FROM categories WHERE slug = 'moda'), (SELECT id FROM users WHERE email = 'esporte@cloudmarket.dev')),
    ('Sofá Retrátil 3 Lugares', 'Sofá retrátil e reclinável com tecido suede.', 1899.00, 2399.00, 6, 'https://picsum.photos/seed/cloudmarket-22/600/600', 'NEW', TRUE, 190, 4.4, (SELECT id FROM categories WHERE slug = 'casa-moveis'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Luminária de Mesa LED', 'Luminária articulada com 3 temperaturas de cor.', 89.90, NULL, 80, 'https://picsum.photos/seed/cloudmarket-23/600/600', 'NEW', FALSE, 1120, 4.7, (SELECT id FROM categories WHERE slug = 'casa-moveis'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev')),
    ('Livro: Arquitetura Limpa na Prática', 'Guia prático de arquitetura de software para devs.', 89.90, 119.90, 60, 'https://picsum.photos/seed/cloudmarket-24/600/600', 'NEW', FALSE, 940, 4.9, (SELECT id FROM categories WHERE slug = 'livros'), (SELECT id FROM users WHERE email = 'casa@cloudmarket.dev'));
