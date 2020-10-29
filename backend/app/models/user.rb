class User < ApplicationRecord
    has_many :posts
    has_many :liked_posts
    has_many :likedPosts, through: :liked_posts, source: :post
    has_secure_password
    validates :username, uniqueness: { case_sensitive: false }
end
