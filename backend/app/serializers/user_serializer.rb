class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :posts, :username, :likedPosts, :isFollowing, :isFollowedBy

  def posts
    object.posts.map do |post|
    {
      id: post.id,
      title: post.title,
      body: post.body,
      img: rails_blob_url(post.featured_image),
      subs: post.suscribedUsers
    }
    end
    
  end
  def likedPosts
    object.likedPosts.map do |post|
    {
      id: post.id,
      title: post.title,
      body: post.body,
      img: rails_blob_url(post.featured_image),
      subs: post.suscribedUsers
    }
    end
  end
end
