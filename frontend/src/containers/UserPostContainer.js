// imports
import { connect } from 'react-redux';
import PostPreview from '../components/PostPreview';
import { updateFollows } from '../redux/actions'
import { followersRoute } from '../railsRoutes';
import UserShellContainer from './UserShellContainer';
// end of imports ------------------------------------------------------

// class copment that handles rendering the post previews for a user
// I made it a class so I could extend from it when making UserLikesContainer
class UserPostContainer extends UserShellContainer {
    

    headerChange = 'Page:'

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

    // maps over provided users posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        return this.state.user.user.posts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }
};
const msp = state => ({ viewingUser: state.user })
const mdp = dispatch => ({updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(UserPostContainer);