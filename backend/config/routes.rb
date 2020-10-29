Rails.application.routes.default_url_options[:host] = "http://localhost:4000/"
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      
      resources :users, only: [:create, :show]
      resources :posts, only: [:create, :index, :show]
      resources :liked_posts, only: [:create]
      post '/login', to: 'auth#create'
      get '/profile', to:'users#profile'
      delete '/liked_posts', to:'liked_posts#destroy'
      
      # post '/posts', to: 'posts#create'
      # get "/posts", to: "posts#index"
    end
  end
end
