import oracledb

DB_USER = 'system'
DB_PASSWORD = 'arish2007'
DB_DSN = 'localhost:1521/xe'

# ──────────────────────────────────────────────────────────────
# Full menu data transcribed from HDMenuCard-1
# ──────────────────────────────────────────────────────────────
MENU_DATA = {
    "shaved_ice": {
        "id": "shaved_ice",
        "label": "Shaved Ice",
        "name": "Shaved Ice",
        "image": "/shaved_ice.jpeg",
        "color": "#74C7EC",
        "items": [
            {"name": "Island Tropical Passion", "price": "90", "desc": "Pineapple · Passion Fruit · Lychee · Topping: Lychee Jelly, Fresh Fruit, Lychee Bits"},
            {"name": "Honeydew Melon Dream", "price": "90", "desc": "Honeydew · Melon · Topping: Lychee Jelly, Nata de Coco"},
            {"name": "Taro Cream Cloud", "price": "90", "desc": "Taro · Topping: Lychee Jelly, Condensed Milk, Dark Choco Filling, Oreo"},
            {"name": "Strawberry Melon Fresh", "price": "90", "desc": "Strawberry · Watermelon · Topping: Honey Melon, Strawberry Purée, Kiwi"},
            {"name": "Blue Lagoon Refresher", "price": "90", "desc": "Blue Curacao · Lychee · Topping: Nata de Coco, Mango, Honey, Refreshing"},
            {"name": "Mojito Breeze", "price": "90", "desc": "Mint · Lime · Topping: Lemon, Mint Leaves"},
            {"name": "Cotton Candy Carnival", "price": "90", "desc": "Cotton Candy Syrup · Strawberry · Topping: Cotton Candy, Strawberry Bits, Mango, Pineapple"},
            {"name": "Dragonfruit Island Crush", "price": "90", "desc": "Dragonfruit · Strawberry · Topping: Lychee Jelly, Fresh Fruit Bits"},
            {"name": "Roses Lychee Royale", "price": "90", "desc": "Rose Syrup · Lychee · Topping: Lychee Jelly, Condensed Milk, Rose Petals"},
            {"name": "Watermelon Island Splash", "price": "90", "desc": "Watermelon · Orange · Topping: Nata de Coco, Mint, Fresh Melon"},
            {"name": "Signature Piña Colada", "price": "90", "desc": "Coconut · Pineapple · Topping: Coconut Flakes, Pineapple Bits"},
            {"name": "Bubblegum Dream Burst", "price": "90", "desc": "Bubblegum Syrup · Strawberry · Topping: Lychee Jelly, Nata de Coco, Bubblegum Bits"},
            {"name": "Taro Rose Fusion", "price": "90", "desc": "Taro · Rose Syrup · Topping: Lychee Jelly, Taro Bits, Cherry Jelly, Condensed Milk"},
            {"name": "Lychee Blue Curaçao Sparkle", "price": "90", "desc": "Lychee · Blue Curaçao · Lime · Topping: Nata de Coco, Lychee Bits, Citrus Splash"},
            {"name": "Hibiscus Glow", "price": "90", "desc": "Hibiscus Syrup · Topping: Hibiscus Jelly, Lemon"},
            {"name": "Blue Lagoon Mojito", "price": "90", "desc": "Blue Curaçao · Lime · Mint · Topping: Fresh Mint"},
        ]
    },
    "bubble_teas": {
        "id": "bubble_teas",
        "label": "Bubble Teas",
        "name": "Bubble Teas",
        "image": "/bubbletea.jpeg",
        "color": "#F4A261",
        "items": [
            {"name": "Peach Paradise Splash", "price": "150", "desc": "Peach Flavour Milk Tea"},
            {"name": "Mango Island Dream", "price": "150", "desc": "Mango Milk Tea"},
            {"name": "Cookie Wave", "price": "150", "desc": "Cookies 'n' Cream Milk Tea"},
            {"name": "Island Bliss", "price": "150", "desc": "Fruit Tea"},
            {"name": "Mango Cheesecake Madness", "price": "150", "desc": "Mango Cheesecake Milk Tea"},
            {"name": "Blue Ocean Breeze", "price": "150", "desc": "Blue Curacao Milk Tea"},
            {"name": "Lychee Lagoon Splash", "price": "150", "desc": "Lychee Milk Tea"},
            {"name": "Bubblegum Splash", "price": "150", "desc": "Bubblegum Milk Tea"},
            {"name": "Melon Chill", "price": "150", "desc": "Honeydew Melon Milk Tea"},
            {"name": "Tropical Sunset", "price": "150", "desc": "Passionfruit Milk Tea"},
            {"name": "Purple Ube Cloud", "price": "150", "desc": "Ube Milk Tea"},
            {"name": "Hong Kong Classic", "price": "150", "desc": "Classic Hong Kong Milk Tea"},
            {"name": "Tutti Frutti Splash", "price": "150", "desc": "Mixed Fruit Tea"},
            {"name": "Thai Tea", "price": "150", "desc": "Original Thai Milk Tea"},
        ]
    },
    "tropical_trios": {
        "id": "tropical_trios",
        "label": "Tropical Trios",
        "name": "Tropical Trios",
        "image": "/tropicaltrio.jpg",
        "color": "#2EC4B6",
        "items": [
            {"name": "Rainbow Rush", "price": "90", "desc": "Strawberry · Blue Curacao · Pineapple · Nata de Coco · Fresh"},
            {"name": "Island Sunset", "price": "90", "desc": "Mango · Coconut · Passionfruit · Fresh"},
            {"name": "Tropical Chill", "price": "90", "desc": "Watermelon · Kiwi · Lychee · Coconut Fresh"},
            {"name": "Mango Mania", "price": "90", "desc": "Mango · Passionfruit · Pineapple"},
            {"name": "Paradise Punch", "price": "90", "desc": "Dragonfruit · Lychee · Pineapple"},
            {"name": "Watermelon Wave", "price": "90", "desc": "Watermelon · Strawberry · Kiwi"},
            {"name": "Island Sunrise", "price": "90", "desc": "Orange · Mango · Passion"},
            {"name": "Cotton Candy Carnival", "price": "90", "desc": "Cotton Candy · Strawberry · Bubblegum · Island Special"},
        ]
    },
    "toppings": {
        "id": "toppings",
        "label": "Toppings",
        "name": "Toppings",
        "image": "/topping.jpeg",
        "color": "#E9C46A",
        "items": [
            {"name": "Vanilla Ice Cream", "price": "50", "desc": "Creamy vanilla ice cream scoop"},
            {"name": "Jellies", "price": "20", "desc": "Assorted fruit jellies"},
            {"name": "Nutella Sauce", "price": "15", "desc": "Rich Nutella drizzle"},
            {"name": "Caramel Sauce", "price": "10", "desc": "Silky caramel drizzle"},
            {"name": "Chocolate Sauce", "price": "10", "desc": "Dark chocolate drizzle"},
            {"name": "Strawberry Purée", "price": "15", "desc": "Fresh strawberry purée"},
            {"name": "Dark Cherry Filling", "price": "10", "desc": "Condensed Milk · Dark Cherry"},
            {"name": "Chocolate Chip", "price": "10", "desc": "Chocolate chip crumbles"},
            {"name": "KitKat", "price": "20", "desc": "Crushed KitKat pieces"},
            {"name": "Nuts", "price": "10", "desc": "Mixed crushed nuts"},
            {"name": "Gems", "price": "10", "desc": "Colourful candy gems"},
            {"name": "Sprinkles", "price": "10", "desc": "Rainbow sugar sprinkles"},
            {"name": "Oreo", "price": "10", "desc": "Crushed Oreo cookies"},
        ]
    },
    "hawaiin_mojitos": {
        "id": "hawaiin_mojitos",
        "label": "Hawaii'n Mojitos",
        "name": "Hawaii'n Mojitos",
        "image": "/hawaiinmojitto.jpg",
        "color": "#57CC99",
        "items": [
            {"name": "Tango Sunrise", "price": "55", "desc": "Orange · Mango · Pineapple"},
            {"name": "Hibiscus Splash", "price": "55", "desc": "Hibiscus · Lemon · Mint"},
            {"name": "Pineapple Twist", "price": "55", "desc": "Pineapple · Lemon · Mint"},
            {"name": "Passion Island", "price": "55", "desc": "Passionfruit · Orange · Lemon"},
        ]
    },
    "cup_pizza": {
        "id": "cup_pizza",
        "label": "Cup Pizza",
        "name": "Cup Pizza",
        "image": "/cup_pizza.jpg",
        "color": "#E76F51",
        "items": [
            {"name": "Hawai'n Delight Veggie Pizza Cup", "price": "90", "desc": "Cheese · Fresh Veggies · Signature Hawaiian Sauce"},
            {"name": "Hawai'n Delight Paneer Pizza Cup", "price": "100", "desc": "Paneer · Capsicum · Onion · Hawaiian Sauce"},
            {"name": "Hawai'n Delight Chicken Pizza Cup", "price": "120", "desc": "Grilled Chicken · Cheese · Bell Peppers"},
        ]
    },
    "aloha_burgers": {
        "id": "aloha_burgers",
        "label": "Aloha Burgers",
        "name": "Aloha Burgers",
        "image": "/aloha_burgers.jpg",
        "color": "#E63946",
        "items": [
            {"name": "Volcano Crispy Veggie Burger", "price": "100", "desc": "Crispy veggie patty with volcano sauce"},
            {"name": "Aloha Onion Po' Boy", "price": "160", "desc": "Crispy onion rings · Lettuce · Aloha sauce"},
            {"name": "Volcano Crispy Chicken Burger", "price": "175", "desc": "Crispy chicken patty · Lettuce · Volcano mayo"},
            {"name": "Big Island BBQ Chicken Burger", "price": "180", "desc": "BBQ glazed grilled chicken · Caramelized onion"},
        ]
    },
    "hawaiin_wraps": {
        "id": "hawaiin_wraps",
        "label": "Hawaii'n Wraps",
        "name": "Hawaii'n Wraps",
        "image": "/hawaiin_wraps.jpg",
        "color": "#F77F00",
        "items": [
            {"name": "Classic Veggie Wrap", "price": "90", "desc": "Fresh vegetables · Signature Hawaiian sauce"},
            {"name": "Classic Paneer Wrap", "price": "180", "desc": "Grilled paneer · Veggies · Mint chutney"},
            {"name": "Cheesy Crispy Chicken Wrap", "price": "180", "desc": "Crispy chicken · Melted cheese · Mayo"},
        ]
    },
    "crispy_crunchy_bites": {
        "id": "crispy_crunchy_bites",
        "label": "Crispy Crunchy Bites",
        "name": "Crispy Crunchy Bites",
        "image": "/crispy_bites.jpg",
        "color": "#FCBF49",
        "items": [
            {"name": "Volcano Fries", "price": "125", "desc": "Crispy fries with volcano seasoning"},
            {"name": "Crispy Fried Chicken", "price": "175", "desc": "Juicy fried chicken pieces"},
            {"name": "Chicken Cheese Balls", "price": "175", "desc": "Cheese-stuffed chicken balls"},
            {"name": "Fish Fingers", "price": "175", "desc": "Golden breaded fish fingers"},
            {"name": "Onion Rings", "price": "175", "desc": "Classic crispy onion rings"},
            {"name": "Jalapeño Cheese DELIGHT", "price": "175", "desc": "Jalapeño & cheese poppers"},
        ]
    },
    "grilled_sandwiches": {
        "id": "grilled_sandwiches",
        "label": "Grilled Sandwiches",
        "name": "Grilled Sandwiches",
        "image": "/grilled_sandwiches.jpg",
        "color": "#8338EC",
        "items": [
            {"name": "Classic Veggie Sandwich", "price": "90", "desc": "Fresh grilled vegetables with cheese"},
            {"name": "Honolulu Egg Melt Sandwich", "price": "160", "desc": "Egg · Cheese · Vegetables · Grilled"},
            {"name": "Volcano Crispy Chicken Sandwich", "price": "180", "desc": "Crispy chicken · Volcano sauce · Lettuce"},
            {"name": "Watermelon Island Splash Sandwich", "price": "90", "desc": "Watermelon jam · Cream · Grilled"},
        ]
    },
    "momos": {
        "id": "momos",
        "label": "Momos",
        "name": "Momos",
        "image": "/momos.jpg",
        "color": "#3A86FF",
        "items": [
            {"name": "Veggie Momo", "price": "120", "desc": "Steamed vegetable dumplings with spicy dip"},
            {"name": "Peri Peri Chicken", "price": "150", "desc": "Chicken momos with peri peri sauce"},
            {"name": "Tandoori Chicken", "price": "150", "desc": "Tandoori spiced chicken momos"},
        ]
    },
    "donuts": {
        "id": "donuts",
        "label": "Donuts",
        "name": "Donuts",
        "image": "/donuts.jpg",
        "color": "#FF6B9D",
        "items": [
            {"name": "Mochi Donuts (1 Pc)", "price": "99", "desc": "1 piece – Strawberry, Chocolate, Mango"},
            {"name": "Mochi Donuts (5 Pcs)", "price": "269", "desc": "5 pieces – Strawberry, Chocolate, Mango"},
            {"name": "Donut Sandwich", "price": "160", "desc": "Strawberry, Chocolate, Mango"},
            {"name": "Macardles (2 Pcs)", "price": "120", "desc": "2 pieces Donut Bread"},
        ]
    },
    "brownies": {
        "id": "brownies",
        "label": "Brownies",
        "name": "Brownies",
        "image": "/brownies.jpg",
        "color": "#6B4226",
        "items": [
            {"name": "Brownie", "price": "90", "desc": "Classic rich chocolate brownie"},
            {"name": "Brownie with Ice Cream", "price": "90", "desc": "Warm brownie topped with vanilla ice cream"},
        ]
    },
    "ice_cream": {
        "id": "ice_cream",
        "label": "Ice Cream",
        "name": "Ice Cream",
        "image": "/ice_cream.jpg",
        "color": "#A8DADC",
        "items": [
            {"name": "Vanilla Bean", "price": "70", "desc": "Classic vanilla bean ice cream"},
            {"name": "Classic Chocolate", "price": "90", "desc": "Rich dark chocolate ice cream"},
            {"name": "Strawberry Cream", "price": "90", "desc": "Fresh strawberry ice cream"},
            {"name": "Butterscotch Delight", "price": "90", "desc": "Buttery butterscotch ice cream"},
            {"name": "Cookies Cream", "price": "90", "desc": "Cookies and cream ice cream"},
            {"name": "Royal Gulkand", "price": "90", "desc": "Traditional gulkand rose ice cream"},
            {"name": "Buterscotch Bliss", "price": "90", "desc": "Extra rich butterscotch"},
            {"name": "Pineapple Bliss", "price": "90", "desc": "Tropical pineapple ice cream"},
        ]
    },
}

def seed_menu():
    print("Connecting to Oracle DB...")
    try:
        connection = oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)
        cursor = connection.cursor()
        print("Connected!")

        # Clear existing menu
        print("Clearing existing menu data...")
        cursor.execute("DELETE FROM MENU_CATEGORIES")
        connection.commit()
        print("Existing menu cleared.")

        # Insert categories and items
        for cat_id, cat in MENU_DATA.items():
            cursor.execute(
                "INSERT INTO MENU_CATEGORIES (cat_id, label, name, image, color) VALUES (:1, :2, :3, :4, :5)",
                [cat["id"], cat["label"], cat["name"], cat["image"], cat["color"]]
            )
            for item in cat["items"]:
                cursor.execute(
                    "INSERT INTO MENU_ITEMS (cat_id, name, price, description) VALUES (:1, :2, :3, :4)",
                    [cat_id, item["name"], item["price"], item["desc"]]
                )
            print(f"  [OK] Inserted category '{cat['label']}' with {len(cat['items'])} items")

        connection.commit()
        print("\nMenu seeded successfully!")
        cursor.close()
        connection.close()

    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == '__main__':
    seed_menu()
