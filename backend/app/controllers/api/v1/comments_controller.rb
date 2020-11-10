class Api::V1::CommentsController < ApplicationController
    
    # standard create
    def create
        comment = Comment.create(commentParams)
        render json: comment
    end

    private

    def commentParams
        params.permit(:user_id, :post_id, :body)
    end
end
