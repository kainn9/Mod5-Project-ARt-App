class CommentSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :body, :proPic

  # we use this serialzer to return a newly created comment after a post method in correct format for the front end to append to state
  def username
    object.user.username
  end

  def proPic
    rails_blob_url(object.user.pro_pic)
  end
end
