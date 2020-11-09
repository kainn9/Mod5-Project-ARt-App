class Api::V1::PostsController < ApplicationController
    # standard index method returns array of all Post(s)
    def index
        @posts = Post.all
        render json: @posts
    end
    # returns post from id param
    def show
        post = Post.find(params[:id])
        render json: post
    end
    # creates post using post params
    def create
        post = Post.create(post_params)
        render json: post
    end
    # updates post using postParams, find post to update by
    def update
        
        post = Post.find(params[:post_id])
        post.update(post_params)

        render json: post
    end

    # note the posts are automatically serialized unlike in the users controller
    private
    def post_params
        params.permit(:title, :body, :featured_image, :user_id)
    end
end
