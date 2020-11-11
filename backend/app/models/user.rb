class User < ApplicationRecord
    has_many :posts
    has_many :liked_posts
    has_many :likedPosts, through: :liked_posts, source: :post

    has_many :follower_relationships, foreign_key: :followed_id, class_name: "FollowJoin"
    has_many :isFollowedBy, through: :follower_relationships, source: :following

    has_many :following_relationships, foreign_key: :following_id, class_name: 'FollowJoin'
    has_many :isFollowing, through: :following_relationships, source: :followed

    has_many :comments

    has_one_attached :pro_pic

    has_secure_password

    validates :username, uniqueness: { case_sensitive: false }
    validates :username, :bio, :password_digest, presence: true
end
