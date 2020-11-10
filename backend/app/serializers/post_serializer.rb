class PostSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :title, :body, :featured_image, :filteredUser, :suscribedUsers, :comments

  # note: pasword_digest is filtered out by serializers

  # using the route helper to to make a url out of the featured img data to use as a src attr on the front end
  def featured_image
    if object.featured_image.attached?
      {
        url: rails_blob_url(object.featured_image)
      }
    end
  end
  # currently, the post only need these three attr from its creator when rendering on front end
  def filteredUser
    { 
      username: object.user.username,
      id: object.user.id,
      proPic: rails_blob_url(object.user.pro_pic)
    }
  end
  # we only need the id's because this is used to check relationships
  def suscribedUsers
    
    object.suscribedUsers.map { |user| user.id }
    
  end
  
  # so we can render comments right from a post show page with 1 fetch
  def comments
    object.comments.map { |comment| {proPic: rails_blob_url(comment.user.pro_pic), username: comment.user.username, body: comment.body} }
  end

end