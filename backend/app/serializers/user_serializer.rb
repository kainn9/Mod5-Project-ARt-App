class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :posts, :username, :likedPosts, :isFollowing, :isFollowedBy, :proPic, :bio

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

  def isFollowing
    
    object.isFollowing.map { |user| { id: user.id, username: user.username } }
  
  end

  def isFollowedBy
    
    object.isFollowedBy.map { |user| { id: user.id, username: user.username } }
    
  end

  def proPic
    if object.pro_pic.attached?
      {
        url: rails_blob_url(object.pro_pic)
      }
    end
  end
end
