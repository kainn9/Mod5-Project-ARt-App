// imports
import PostPreview from '../components/PostPreview';
import UserShellContainer from './UserShellContainer';
import { updateFollows } from '../redux/actions';
import { connect } from 'react-redux';
import { followersRoute } from '../railsRoutes';
// end of imports ------------------------------------------------------



// I normally like to write all functional components but wanted to demonstrate knowledge of also class based for legacy code.
// I used UserShellContainer as a parent for UserLikedContainer and UserPostContainer since they are so similair
// however I personally dont think class based inheritance plays nice with redux and more modern react patterns
class UserLikedContainer extends UserShellContainer {
    
    // for page header
    headerChange = 'Likes:'

   // checks if logged in user is following the previewed user
   isLoggedUserFollowingPreviewedUser = () => {
    console.log('loggedUser', this.props.loggedUser.id)
    const idsOfFollowing = this.props.loggedUser.isFollowing.map(user => user.id)
    console.log('loggedUser', this.props.loggedUser.id)
    return idsOfFollowing.includes(this.state.user.id)
}

// checks if the logged in user is the previewed user
isLoggedUserViewingSelf = () => this.props.loggedUser.id === this.state.user.id
    
    followHandler = () => {
        const httpVerb = this.isViewerFollowing() ? 'DELETE' : 'POST';
        const fetchConfig = {
            method: `${httpVerb}`,
            headers: {
                Authorization: `Bearer ${this.state.token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                following_id: this.props.viewingUser.user.id,
                followed_id: this.state.user.id
            })
        }

        fetch(followersRoute, fetchConfig)
        .then( response => response.json())
        .then(data => {
            this.props.updateFollowerState(this.state.user.id)

        })
        
    }


    // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.likedPosts)
        return this.state.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}

const msp = state => ({ loggedUser: state.user.user })
const mdp = dispatch => ({ updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(UserLikedContainer);