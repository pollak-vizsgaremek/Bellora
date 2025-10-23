CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES Categories(category_id)
);

CREATE TABLE Items (
    item_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    category_id INT REFERENCES Categories(category_id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES Users(user_id),
    seller_id INT REFERENCES Users(user_id),
    item_id INT REFERENCES Items(item_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES Orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES Users(user_id),
    receiver_id INT REFERENCES Users(user_id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Favorites (
    user_id INT REFERENCES Users(user_id),
    item_id INT REFERENCES Items(item_id),
    PRIMARY KEY(user_id, item_id)
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    reviewer_id INT REFERENCES Users(user_id),
    reviewed_user_id INT REFERENCES Users(user_id),
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Shipping (
    shipping_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES Orders(order_id),
    address TEXT NOT NULL,
    carrier VARCHAR(50),
    tracking_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'processing'
);
