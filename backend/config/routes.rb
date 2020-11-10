Rails.application.routes.default_url_options[:host] = "http://localhost:4000/"
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      
      resources :users, only: [:create, :show]
      resources :posts, only: [:create, :index, :show, :update]
      resources :liked_posts, only: [:create]
      resources :comments, only: [:create]
      
      post '/login', to: 'auth#create'
      get '/profile', to:'users#profile'

      delete '/liked_posts', to: 'liked_posts#destroy'

      post '/search', to: 'search#search'

      post '/followers', to: 'followers#create'
      delete '/followers', to: 'followers#destroy'
      
      post '/feed', to: 'users#feed'
    end
  end
end
