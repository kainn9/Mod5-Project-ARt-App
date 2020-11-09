class Api::V1::LikedPostsController < ApplicationController
    # creates liked relationship with user and post with their ids
    def create
        likedRelationship = LikedPost.create(likedParams)

        render json: { message: 'created'}, status: :created
    end

    # deletes liked relationship with user and post with their ids, I think .where is more more optimal than enums
    def destroy

        foundPost = LikedPost.where(user_id: params[:user_id], post_id: params[:post_id])
        
        LikedPost.destroy(foundPost[0].id)
        render json: { message: 'deleted' }
    end


    private

    def likedParams
        params.permit(:user_id, :post_id)
    end
end
