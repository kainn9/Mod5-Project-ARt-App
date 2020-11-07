class FollowJoin < ApplicationRecord
    belongs_to :following, foreign_key: 'following_id', class_name: 'User'
    belongs_to :followed, foreign_key: 'followed_id', class_name: 'User'
end
