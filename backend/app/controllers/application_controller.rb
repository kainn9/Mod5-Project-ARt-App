class ApplicationController < ActionController::API
    before_action :authorized

    # enocdes a token from payload
    def encode_token(payload)
        # should store secret in env variable later
        JWT.encode(payload, 'kainan-secret')
    end

    # used to check for Authorization header from incoming fetch
    def auth_header
        request.headers['Authorization']
    end
    
    # if used to decode token when auth header is present
    def decoded_token
        if auth_header
            token = auth_header.split(' ')[1]
            
            begin
                JWT.decode(token, 'kainan-secret', true, algorithm: 'HS256')
            rescue JWT::DecodeError
                nil
            end
        end
    end
    
    # user decoded token to get logged user
    def current_user
        if decoded_token
            user_id = decoded_token[0]['user_id']
            @user = User.find_by(id: user_id)
        end
    end
    
    # returns bool value of current user class method
    def logged_in?
        !!current_user
    end
    
    # before action for whole app -> does not give access unless logged_in returns true
    def authorized
        render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
    end
end
