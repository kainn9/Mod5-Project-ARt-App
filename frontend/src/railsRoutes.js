// gets user with existing token
export const getUserRoute = 'http://localhost:3000/api/v1/profile/';

// login for token
export const loginRoute = 'http://localhost:3000/api/v1/login/';

// post method for sign-up...add id for show page
export const usersRoute = 'http://localhost:3000/api/v1/users/';

// post to create get for index
export const postsRoute = 'http://localhost:3000/api/v1/posts';

// Post to create, Delete to to remove--> does not use url params pass in user_id and post_id
export const likedPostsRoute = 'http://localhost:3000/api/v1/liked_posts';

export const searchRoute = 'http://localhost:3000/api/v1/search';

// post to add friends with both ids, delete verb for opposite
export const followersRoute = 'http://localhost:3000/api/v1/followers';

// post req with user id to get their feed
export const feedRoute = 'http://localhost:3000/api/v1/feed';

// post to create comment with userID and postID
export const commentRoute = 'http://localhost:3000/api/v1/comments';

// converts activeStorage url into usable url:
export const activeStorageUrlConverter = (url) => {
    return `http://localhost:3000/rails${url.split('rails')[1]}`
}