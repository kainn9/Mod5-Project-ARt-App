class Api::V1::FollowersController < ApplicationController
    # creates a follower/followed relationship using following_id, and followed_id
    def create
        FollowJoin.create(followJoinParams)
        render json: { message: 'followed' }, status: :created
    end
    # deletes a following/followed relatiionship using the ids...wanted to use where because I think its more efficent then enums
    def destroy
        followJoin = FollowJoin.where(followed_id: params[:followed_id], following_id: params[:following_id])
        
        FollowJoin.destroy(followJoin[0].id)
        
        render json: { message: 'deleted' }, status: :accepted
    end

    private

    def followJoinParams
        params.permit(:following_id, :followed_id)
    end
end
