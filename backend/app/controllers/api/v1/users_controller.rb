class Api::V1::UsersController < ApplicationController
    skip_before_action :authorized, only: [:create]
 
    def create
        @user = User.create(user_params)
        if @user.valid?

            @token = encode_token(user_id: @user.id)
            render json: { user: UserSerializer.new(@user), jwt: @token }, status: :created

        else
            render json: { error: 'failed to create user' }, status: :failed
        end
    end

    def show
        foundUser = User.find(params[:id])
        render json: { user: UserSerializer.new(foundUser) }, status: :accepted
    end

    def profile
        render json: { user: UserSerializer.new(current_user) }, status: :accepted
    end

    def feed
      user = User.find(params[:id])

      ids = user.isFollowing.map { |user| user.id }

      posts = Post.where(user_id: ids).left_joins(:liked_posts).group(:id).order('created_at DESC, COUNT(liked_posts.id) DESC').limit(100)

      render json: posts, status: :accepted
  
    end
 
    private
 
    def user_params
        params.permit(:username, :password, :bio, :pro_pic)
    end
end