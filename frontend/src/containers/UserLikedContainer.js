// imports
import PostPreview from '../components/PostPreview';
import UserShellContainer from './UserShellContainer';
import { updateFollows } from '../redux/actions';
import { connect } from 'react-redux';
import { followersRoute } from '../railsRoutes';
// end of imports ------------------------------------------------------



// same as user posts but filters base likes also
class UserLikedContainer extends UserShellContainer {
    headerChange = 'Likes:'



    // place holder for extended classes since Redux does not play nice
    isViewerFollowing = () => {
        const idsOfFollowing = this.props.viewingUser.user.isFollowing.map(user => user.id)

        return idsOfFollowing.includes(this.state.user.user.id)
    }
    
    // place holder for extended classes since Redux does not play nice
    isViewerUser = () => this.props.viewingUser.user.id === this.state.user.user.id
    
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
                followed_id: this.state.user.user.id
            })
        }

        fetch(followersRoute, fetchConfig)
        .then( response => response.json())
        .then(data => {
            this.props.updateFollowerState(this.state.user.user.id)

        })
        
    }


    // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.user.likedPosts)
        return this.state.user.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}

const msp = state => ({ viewingUser: state.user })
const mdp = dispatch => ({ updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(UserLikedContainer);