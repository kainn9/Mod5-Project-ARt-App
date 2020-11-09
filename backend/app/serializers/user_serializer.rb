class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :posts, :username, :likedPosts, :isFollowing, :isFollowedBy, :proPic, :bio

  # note: pasword_digest is filtered out by serializers

  # we needed a serialzer to get the  img urls from posts and some other bits of data like subs
  def posts
    object.posts.map do |post|
    {
      id: post.id,
      title: post.title,
      body: post.body,
      img: rails_blob_url(post.featured_image),
      subs: post.suscribedUsers,
      ownerID: post.user.id
    }
    end
    
  end

  # same as above but for liked posts
  def likedPosts
    object.likedPosts.map do |post|
    {
      id: post.id,
      title: post.title,
      body: post.body,
      img: rails_blob_url(post.featured_image),
      subs: post.suscribedUsers,
      ownerID: post.user.id
    }
    end
  end

  # we need to serialze to get the propic as url and to remove sensitve/extra data from array of users
  def isFollowing
    
    object.isFollowing.map { |user| { id: user.id, username: user.username, proPic: rails_blob_url(user.pro_pic), bio: user.bio } }
  
  end

  # we need to serialze to get the propic as url and to remove sensitve/extra data from array of users
  def isFollowedBy
    
    object.isFollowedBy.map { |user| { id: user.id, username: user.username, proPic: rails_blob_url(user.pro_pic), bio: user.bio } }
    
  end
  # serialzer to make pro pic url
  def proPic
    if object.pro_pic.attached?
      {
        url: rails_blob_url(object.pro_pic)
      }
    end
  end
end
