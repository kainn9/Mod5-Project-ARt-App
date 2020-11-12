require 'faker'




User.destroy_all
Post.destroy_all
LikedPost.destroy_all
FollowJoin.destroy_all
Comment.destroy_all

pro_pic = 1

11.times do 
  user = User.create(username: Faker::Name.unique.name, password_digest: BCrypt::Password.create('123'), bio: Faker::Quote.famous_last_words)
  user.pro_pic.attach(io: File.open(Rails.root.join("db", "data", "profileImages", "#{pro_pic}")), filename: "#{pro_pic}")

  pro_pic = pro_pic + 1
end



100.times do 
  file = 1 + rand(31)
  post = Post.create(title: Faker::Games::LeagueOfLegends.quote, body: Faker::Games::Fallout.quote, user_id: User.all.sample.id)
  post.featured_image.attach(io: File.open(Rails.root.join("db", "data", "postImages", "#{file}")), filename: "#{file}")
end


30.times do 
  User.all.each do |u|
    LikedPost.create(user_id: u.id, post_id: Post.all.sample.id)
  end

end

6.times do 
  User.all.each do |u|
    FollowJoin.create(following_id: u.id, followed_id: User.all.filter{|u2| u2.id != u.id }.sample.id)
  end

end

6.times do 
  User.all.each do |u|
    Comment.create(user: u, post: Post.all.sample, body: Faker::Hipster.sentences)
  end

end

tester = User.create(username: 'tester123', password_digest: BCrypt::Password.create('123'), bio: 'for testing')
tester.pro_pic.attach(io: File.open(Rails.root.join("db", "data", "profileImages", '3')), filename: 3)