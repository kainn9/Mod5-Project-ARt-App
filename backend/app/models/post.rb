class Post < ApplicationRecord
    belongs_to :user
    has_one_attached :featured_image
end
