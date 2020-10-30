// imports
import PostPreview from '../components/PostPreview';
import UserShellContainer from './UserShellContainer';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
// end of imports ------------------------------------------------------



// same as user posts but filters base likes also
class UserLikedContainer extends UserShellContainer {
    headerChange = 'Likes:'



    // place holder for extended classes since Redux does not play nice
    isViewerFollowing = () => {
        console.log(this.props.viewingUser.user.isFollowing)
        const idsOfFollowing = this.props.viewingUser.user.isFollowing.map(user => user.id)

        return idsOfFollowing.includes(this.state.user.user.id)
    }
    // place holder for extended classes since Redux does not play nice
    isViewerUser = () => this.props.viewingUser.user.id === this.state.user.user.id
    // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.user.likedPosts)
        return this.state.user.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}

const msp = state => ({ viewingUser: state.user })

export default connect(msp, null)(UserLikedContainer);