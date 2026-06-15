-- Hawaii'n Delight - Final Menu Seed
-- 1. Create tables and disable security bits
CREATE TABLE IF NOT EXISTS menu_categories (cat_id TEXT PRIMARY KEY, label TEXT, name TEXT, image TEXT, color TEXT, sort_order INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS menu_items (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, cat_id TEXT REFERENCES menu_categories(cat_id) ON DELETE CASCADE, name TEXT, price TEXT, description TEXT);
ALTER TABLE menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
-- 3. Clear existing data
DELETE FROM menu_items;
DELETE FROM menu_categories;
DELETE FROM reels;
-- 4. Insert Categories
INSERT INTO menu_categories (cat_id, label, name, image, color) VALUES
('shaved_ice',          'Shaved Ice',           'Shaved Ice',           '/shaved_ice.jpeg',       '#74C7EC'),
('bubble_teas',         'Bubble Teas',           'Bubble Teas',           '/bubbletea.jpeg',        '#F4A261'),
('tropical_trios',      'Tropical Trios',        'Tropical Trios',        '/tropicaltrio.jpg',      '#2EC4B6'),
('toppings',            'Toppings',              'Toppings',              '/topping.jpeg',           '#E9C46A'),
('hawaiin_mojitos',     'Hawaii''n Mojitos',     'Hawaii''n Mojitos',     '/hawaiinmojitto.jpg',    '#57CC99'),
('cup_pizza',           'Cup Pizza',             'Cup Pizza',             '/cup_pizza.jpg',          '#E76F51'),
('aloha_burgers',       'Aloha Burgers',         'Aloha Burgers',         '/aloha_burgers.jpg',     '#E63946'),
('hawaiin_wraps',       'Hawaii''n Wraps',       'Hawaii''n Wraps',       '/hawaiin_wraps.jpg',     '#F77F00'),
('crispy_crunchy_bites','Crispy Crunchy Bites',  'Crispy Crunchy Bites',  '/crispy_bites.jpg',      '#FCBF49'),
('grilled_sandwiches',  'Grilled Sandwiches',    'Grilled Sandwiches',    '/grilled_sandwiches.jpg','#8338EC'),
('momos',               'Momos',                 'Momos',                 '/momos.jpg',              '#3A86FF'),
('donuts',              'Donuts',                'Donuts',                '/donuts.jpg',             '#FF6B9D'),
('brownies',            'Brownies',              'Brownies',              '/brownies.jpg',           '#6B4226'),
('ice_cream',           'Ice Cream',             'Ice Cream',             '/ice_cream.jpg',          '#A8DADC');
-- 5. Insert Items
-- Shaved Ice
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('shaved_ice', 'Island Tropical Passion',   '90', 'Pineapple · Passion Fruit · Lychee · Topping: Lychee Jelly, Fresh Fruit, Lychee Bits'),
('shaved_ice', 'Honeydew Melon Dream',      '90', 'Honeydew · Melon · Topping: Lychee Jelly, Nata de Coco'),
('shaved_ice', 'Taro Cream Cloud',          '90', 'Taro · Topping: Lychee Jelly, Condensed Milk, Dark Choco Filling, Oreo'),
('shaved_ice', 'Strawberry Melon Fresh',    '90', 'Strawberry · Watermelon · Topping: Honey Melon, Strawberry Purée, Kiwi'),
('shaved_ice', 'Blue Lagoon Refresher',     '90', 'Blue Curacao · Lychee · Topping: Nata de Coco, Mango, Honey, Refreshing'),
('shaved_ice', 'Mojito Breeze',             '90', 'Mint · Lime · Topping: Lemon, Mint Leaves'),
('shaved_ice', 'Cotton Candy Carnival',     '90', 'Cotton Candy Syrup · Strawberry · Topping: Cotton Candy, Strawberry Bits, Mango, Pineapple'),
('shaved_ice', 'Dragonfruit Island Crush',  '90', 'Dragonfruit · Strawberry · Topping: Lychee Jelly, Fresh Fruit Bits'),
('shaved_ice', 'Roses Lychee Royale',       '90', 'Rose Syrup · Lychee · Topping: Lychee Jelly, Condensed Milk, Rose Petals'),
('shaved_ice', 'Watermelon Island Splash',  '90', 'Watermelon · Orange · Topping: Nata de Coco, Mint, Fresh Melon'),
('shaved_ice', 'Signature Piña Colada',     '90', 'Coconut · Pineapple · Topping: Coconut Flakes, Pineapple Bits'),
('shaved_ice', 'Bubblegum Dream Burst',     '90', 'Bubblegum Syrup · Strawberry · Topping: Lychee Jelly, Nata de Coco, Bubblegum Bits'),
('shaved_ice', 'Taro Rose Fusion',          '90', 'Taro · Rose Syrup · Topping: Lychee Jelly, Taro Bits, Cherry Jelly, Condensed Milk'),
('shaved_ice', 'Lychee Blue Curaçao Sparkle','90','Lychee · Blue Curaçao · Lime · Topping: Nata de Coco, Lychee Bits, Citrus Splash'),
('shaved_ice', 'Hibiscus Glow',             '90', 'Hibiscus Syrup · Topping: Hibiscus Jelly, Lemon'),
('shaved_ice', 'Blue Lagoon Mojito',        '90', 'Blue Curaçao · Lime · Mint · Topping: Fresh Mint');
-- Bubble Teas
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('bubble_teas', 'Peach Paradise Splash',    '150', 'Peach Flavour Milk Tea'),
('bubble_teas', 'Mango Island Dream',       '150', 'Mango Milk Tea'),
('bubble_teas', 'Cookie Wave',              '150', 'Cookies ''n'' Cream Milk Tea'),
('bubble_teas', 'Island Bliss',             '150', 'Fruit Tea'),
('bubble_teas', 'Mango Cheesecake Madness', '150', 'Mango Cheesecake Milk Tea'),
('bubble_teas', 'Blue Ocean Breeze',        '150', 'Blue Curacao Milk Tea'),
('bubble_teas', 'Lychee Lagoon Splash',     '150', 'Lychee Milk Tea'),
('bubble_teas', 'Bubblegum Splash',         '150', 'Bubblegum Milk Tea'),
('bubble_teas', 'Melon Chill',              '150', 'Honeydew Melon Milk Tea'),
('bubble_teas', 'Tropical Sunset',          '150', 'Passionfruit Milk Tea'),
('bubble_teas', 'Purple Ube Cloud',         '150', 'Ube Milk Tea'),
('bubble_teas', 'Hong Kong Classic',        '150', 'Classic Hong Kong Milk Tea'),
('bubble_teas', 'Tutti Frutti Splash',      '150', 'Mixed Fruit Tea'),
('bubble_teas', 'Thai Tea',                 '150', 'Original Thai Milk Tea');
-- Tropical Trios
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('tropical_trios', 'Rainbow Rush',         '90', 'Strawberry · Blue Curacao · Pineapple · Nata de Coco · Fresh'),
('tropical_trios', 'Island Sunset',        '90', 'Mango · Coconut · Passionfruit · Fresh'),
('tropical_trios', 'Tropical Chill',       '90', 'Watermelon · Kiwi · Lychee · Coconut Fresh'),
('tropical_trios', 'Mango Mania',          '90', 'Mango · Passionfruit · Pineapple'),
('tropical_trios', 'Paradise Punch',       '90', 'Dragonfruit · Lychee · Pineapple'),
('tropical_trios', 'Watermelon Wave',      '90', 'Watermelon · Strawberry · Kiwi'),
('tropical_trios', 'Island Sunrise',       '90', 'Orange · Mango · Passion'),
('tropical_trios', 'Cotton Candy Carnival','90', 'Cotton Candy · Strawberry · Bubblegum · Island Special');
-- Toppings
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('toppings', 'Vanilla Ice Cream',  '50', 'Creamy vanilla ice cream scoop'),
('toppings', 'Jellies',            '20', 'Assorted fruit jellies'),
('toppings', 'Nutella Sauce',      '15', 'Rich Nutella drizzle'),
('toppings', 'Caramel Sauce',      '10', 'Silky caramel drizzle'),
('toppings', 'Chocolate Sauce',    '10', 'Dark chocolate drizzle'),
('toppings', 'Strawberry Purée',   '15', 'Fresh strawberry purée'),
('toppings', 'Dark Cherry Filling','10', 'Condensed Milk · Dark Cherry'),
('toppings', 'Chocolate Chip',     '10', 'Chocolate chip crumbles'),
('toppings', 'KitKat',             '20', 'Crushed KitKat pieces'),
('toppings', 'Nuts',               '10', 'Mixed crushed nuts'),
('toppings', 'Gems',               '10', 'Colourful candy gems'),
('toppings', 'Sprinkles',          '10', 'Rainbow sugar sprinkles'),
('toppings', 'Oreo',               '10', 'Crushed Oreo cookies');
-- Hawaii'n Mojitos
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('hawaiin_mojitos', 'Tango Sunrise',   '55', 'Orange · Mango · Pineapple'),
('hawaiin_mojitos', 'Hibiscus Splash', '55', 'Hibiscus · Lemon · Mint'),
('hawaiin_mojitos', 'Pineapple Twist', '55', 'Pineapple · Lemon · Mint'),
('hawaiin_mojitos', 'Passion Island',  '55', 'Passionfruit · Orange · Lemon');
-- Cup Pizza
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('cup_pizza', 'Hawai''n Delight Veggie Pizza Cup',   '90',  'Cheese · Fresh Veggies · Signature Hawaiian Sauce'),
('cup_pizza', 'Hawai''n Delight Paneer Pizza Cup',   '100', 'Paneer · Capsicum · Onion · Hawaiian Sauce'),
('cup_pizza', 'Hawai''n Delight Chicken Pizza Cup',  '120', 'Grilled Chicken · Cheese · Bell Peppers');
-- Aloha Burgers
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('aloha_burgers', 'Volcano Crispy Veggie Burger',   '100', 'Crispy veggie patty with volcano sauce'),
('aloha_burgers', 'Aloha Onion Po'' Boy',           '160', 'Crispy onion rings · Lettuce · Aloha sauce'),
('aloha_burgers', 'Volcano Crispy Chicken Burger',  '175', 'Crispy chicken patty · Lettuce · Volcano mayo'),
('aloha_burgers', 'Big Island BBQ Chicken Burger',  '180', 'BBQ glazed grilled chicken · Caramelized onion');
-- Hawaii'n Wraps
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('hawaiin_wraps', 'Classic Veggie Wrap',          '90',  'Fresh vegetables · Signature Hawaiian sauce'),
('hawaiin_wraps', 'Classic Paneer Wrap',          '180', 'Grilled paneer · Veggies · Mint chutney'),
('hawaiin_wraps', 'Cheesy Crispy Chicken Wrap',   '180', 'Crispy chicken · Melted cheese · Mayo');
-- Crispy Crunchy Bites
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('crispy_crunchy_bites', 'Volcano Fries',          '125', 'Crispy fries with volcano seasoning'),
('crispy_crunchy_bites', 'Crispy Fried Chicken',   '175', 'Juicy fried chicken pieces'),
('crispy_crunchy_bites', 'Chicken Cheese Balls',   '175', 'Cheese-stuffed chicken balls'),
('crispy_crunchy_bites', 'Fish Fingers',           '175', 'Golden breaded fish fingers'),
('crispy_crunchy_bites', 'Onion Rings',            '175', 'Classic crispy onion rings'),
('crispy_crunchy_bites', 'Jalapeño Cheese DELIGHT','175', 'Jalapeño & cheese poppers');
-- Grilled Sandwiches
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('grilled_sandwiches', 'Classic Veggie Sandwich',             '90',  'Fresh grilled vegetables with cheese'),
('grilled_sandwiches', 'Honolulu Egg Melt Sandwich',          '160', 'Egg · Cheese · Vegetables · Grilled'),
('grilled_sandwiches', 'Volcano Crispy Chicken Sandwich',     '180', 'Crispy chicken · Volcano sauce · Lettuce'),
('grilled_sandwiches', 'Watermelon Island Splash Sandwich',   '90',  'Watermelon jam · Cream · Grilled');
-- Momos
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('momos', 'Veggie Momo',        '120', 'Steamed vegetable dumplings with spicy dip'),
('momos', 'Peri Peri Chicken',  '150', 'Chicken momos with peri peri sauce'),
('momos', 'Tandoori Chicken',   '150', 'Tandoori spiced chicken momos');
-- Donuts
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('donuts', 'Mochi Donuts (1 Pc)', '99',  '1 piece – Strawberry, Chocolate, Mango'),
('donuts', 'Mochi Donuts (5 Pcs)','269', '5 pieces – Strawberry, Chocolate, Mango'),
('donuts', 'Donut Sandwich',      '160', 'Strawberry, Chocolate, Mango'),
('donuts', 'Macardles (2 Pcs)',   '120', '2 pieces Donut Bread');
-- Brownies
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('brownies', 'Brownie',                 '90', 'Classic rich chocolate brownie'),
('brownies', 'Brownie with Ice Cream',  '90', 'Warm brownie topped with vanilla ice cream');
-- Ice Cream
INSERT INTO menu_items (cat_id, name, price, description) VALUES
('ice_cream', 'Vanilla Bean',       '70', 'Classic vanilla bean ice cream'),
('ice_cream', 'Classic Chocolate',  '90', 'Rich dark chocolate ice cream'),
('ice_cream', 'Strawberry Cream',   '90', 'Fresh strawberry ice cream'),
('ice_cream', 'Butterscotch Delight','90','Buttery butterscotch ice cream'),
('ice_cream', 'Cookies Cream',      '90', 'Cookies and cream ice cream'),
('ice_cream', 'Royal Gulkand',      '90', 'Traditional gulkand rose ice cream'),
('ice_cream', 'Buterscotch Bliss',  '90', 'Extra rich butterscotch'),
('ice_cream', 'Pineapple Bliss',    '90', 'Tropical pineapple ice cream');
-- 6. Seed Reels
INSERT INTO reels (reel_id) VALUES
('DWyeM0BTA6h'),
('DWqwIDugU1G'),
('DRzRwqZAToa'),
('DQwJY-IAS8D');
