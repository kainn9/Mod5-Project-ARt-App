// gets user with existing token
export const getUserRoute = 'http://localhost:3000/api/v1/profile/';

// login for token
export const loginRoute = 'http://localhost:3000/api/v1/login/';

// post method for sign-up...add id for show page
export const usersRoute = 'http://localhost:3000/api/v1/users/';
// post to create get for index
export const postsRoute = 'http://localhost:3000/api/v1/posts'



// converts activeStorage url into usable url:
export const activeStorageUrlConverter = (url) => {
    return `http://localhost:3000/rails${url.split('rails')[1]}`
}