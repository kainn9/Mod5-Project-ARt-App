class PostSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :title, :body, :featured_image, :filteredUser, :suscribedUsers


  def featured_image
    if object.featured_image.attached?
      {
        url: rails_blob_url(object.featured_image)
      }
    end
  end

  def filteredUser
    { 
      username: object.user.username,
      id: object.user.id
    }
  end
end