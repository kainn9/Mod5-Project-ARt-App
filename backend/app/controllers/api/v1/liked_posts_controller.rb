class Api::V1::LikedPostsController < ApplicationController

    def create
        likedRelationship = LikedPost.create(likedParams)

        render json: { message: 'created'}, status: :created
    end

    def destroy
        found_post = Post.find(params[:post_id])

        found_joiner = found_post.liked_posts.find do |liked_post|
            liked_post.user_id == params[:user_id]
        end

        LikedPost.destroy(found_joiner.id)
        render json: { message: 'deleted' }
    end


    private

    def likedParams
        params.permit(:user_id, :post_id)
    end
end
