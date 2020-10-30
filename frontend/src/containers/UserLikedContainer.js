// imports
import PostPreview from '../components/PostPreview';
import UserShellContainer from './UserShellContainer';
import { Button } from 'semantic-ui-react';
// end of imports ------------------------------------------------------



// same as user posts but filters base likes also
class UserLikedContainer extends UserShellContainer {
    headerChange = 'Likes:'


    linkToLikesOrMain = () => (
        <Button color='orange'>view likes</Button>
    )
    // place holder for extended classes since Redux does not play nice
    isViewerFollowing = () => {
        return true;
    }
    // place holder for extended classes since Redux does not play nice
    isViewerUser = () => {
        return true;
    }
    // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.user.likedPosts)
        return this.state.user.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}


export default UserLikedContainer;