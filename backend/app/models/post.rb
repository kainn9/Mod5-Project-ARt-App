class Post < ApplicationRecord
    belongs_to :user
    has_one_attached :featured_image
    has_many :liked_posts
    has_many :suscribedUsers, through: :liked_posts, source: :user
    has_many :comments
end
