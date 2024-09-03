-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                
    provider_id VARCHAR(255) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE,            
    role VARCHAR(50) DEFAULT 'owner',     
    provider VARCHAR(50) NOT NULL,        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Restaurants Table with ownerID referencing Users
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    website VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    ownerID INT REFERENCES users(id) ON DELETE SET NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tables Table
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
    qr_code VARCHAR(255) NOT NULL
);

-- Create Menu Categories Table
CREATE TABLE menu_categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- Create Menu Items Table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Customization Groups Table
CREATE TABLE customization_groups (
    id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,                -- E.g., "Choose your size", "Select toppings"
    is_required BOOLEAN DEFAULT FALSE,         -- Indicates if the customization is required
    max_selections INT DEFAULT 1               -- Specifies the maximum number of selections allowed
);

-- Create Customization Options Table
CREATE TABLE customization_options (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES customization_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,                -- E.g., "Small", "Medium", "Extra Cheese"
    additional_price DECIMAL(10, 2) DEFAULT 0.00
);

-- Create Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL
);

-- Create Order Item Customizations Table
CREATE TABLE order_item_customizations (
    id SERIAL PRIMARY KEY,
    order_item_id INT REFERENCES order_items(id) ON DELETE CASCADE,
    customization_option_id INT REFERENCES customization_options(id) ON DELETE CASCADE,
    additional_price DECIMAL(10, 2) NOT NULL
);