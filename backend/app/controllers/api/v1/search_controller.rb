class Api::V1::SearchController < ApplicationController
    # queries db using .where to match first 5 users/posts each by title/username to searchParams
    def search
        usersQuery = User.where("username LIKE ?", "%" + params[:search] + "%").take(5)

        postsQuery = Post.where("title LIKE ?", "%" + params[:search] + "%").take(5)

        usersQuerySerialized = usersQuery.map do |user|
            UserSerializer.new(user)
        end
        
        postQuerySerialized = postsQuery.map do |post|
            PostSerializer.new(post)
        end
        
        render json: { users: usersQuerySerialized, posts: postQuerySerialized }, status: :created
        
    end

end
