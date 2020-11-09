class Api::V1::UsersController < ApplicationController
    skip_before_action :authorized, only: [:create]
    
    # this is for signup which is why its located in the userControlelr over auth(while it does encode a token, a new user is also being created)
    def create
        @user = User.create(user_params)
        if @user.valid?

            @token = encode_token(user_id: @user.id)
            render json: { user: UserSerializer.new(@user), jwt: @token }, status: :created

        else
            render json: { error: 'failed to create user' }, status: :failed
        end
    end

    # this is for fetching users using params[:id]
    def show
        foundUser = User.find(params[:id])
        render json: { user: UserSerializer.new(foundUser) }, status: :accepted
    end

    # this is how we get the logged in user if they are alreadt logged and already have a jwt in local storage, unlike #show it gets the user from the current_user application class method
    def profile
        render json: { user: UserSerializer.new(current_user) }, status: :accepted
    end

    # takes in user ID and generates feed for the user
    def feed
        # find the user
      user = User.find(params[:id])
        # the the ids of the ppl user is following
      ids = user.isFollowing.map { |user| user.id }
        # I wanted to use .where and .order because I think they are more optimal than enums
        # This should return posts that have a matching user_id column prop to the array of ids and then order them desending by creation date followed by number of likes if the created by is equal. It limits results to 100
      posts = Post.where(user_id: ids).left_joins(:liked_posts).group(:id).order('created_at DESC, COUNT(liked_posts.id) DESC').limit(100)

      render json: posts, status: :accepted
  
    end
 
    # note it appears that when you render json: user it automatically serializes but this does not happen if user is nested inside a hash{}...which is neccessary to also return our JWT in the create action
    # for consistency the other methods return the user in this way but it does not need to be done like this
    private
 
    def user_params
        params.permit(:username, :password, :bio, :pro_pic)
    end
end