import User from './User.js';
import Category from './Category.js';
import Item from './Item.js';
import ItemImage from './ItemImage.js';
import Order from './Order.js';
import Payment from './Payment.js';
import Message from './Message.js';
import Favorite from './Favorite.js';
import Review from './Review.js';
import Shipping from './Shipping.js';

User.hasMany(Item, { foreignKey: 'user_id', as: 'items' });
Item.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

Category.hasMany(Item, { foreignKey: 'category_id', as: 'items' });
Item.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

Item.hasMany(ItemImage, { foreignKey: 'item_id', as: 'images' });
ItemImage.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

User.hasMany(Order, { foreignKey: 'buyer_id', as: 'purchases' });
Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });

User.hasMany(Order, { foreignKey: 'seller_id', as: 'sales' });
Order.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

Item.hasMany(Order, { foreignKey: 'item_id', as: 'orders' });
Order.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Order.hasOne(Shipping, { foreignKey: 'order_id', as: 'shipping' });
Shipping.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

User.belongsToMany(Item, { through: Favorite, foreignKey: 'user_id', as: 'favoriteItems' });
Item.belongsToMany(User, { through: Favorite, foreignKey: 'item_id', as: 'favoritedBy' });

User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

User.hasMany(Review, { foreignKey: 'reviewed_user_id', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewed_user_id', as: 'reviewedUser' });

export {
  User,
  Category,
  Item,
  ItemImage,
  Order,
  Payment,
  Message,
  Favorite,
  Review,
  Shipping
};
