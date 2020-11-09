// imports
import { connect } from 'react-redux';
import PostPreview from '../components/PostPreview';
import { updateFollows } from '../redux/actions';
import UserShellContainer from './UserShellContainer';
// end of imports ------------------------------------------------------

// normally like to write all functional components but wanted to demonstratea little knowledge of also class based too
// I used UserShellContainer as a parent for UserLikedContainer and UserPostContainer since they are similair
// class based doesnt seem to play so nicely with redux
class UserPostContainer extends UserShellContainer {
    
    // for user header
    headerChange = 'Page:'
    
    // maps over provided users posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        return this.state.user.posts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }
};
const msp = state => ({ loggedUser: state.user.user })
const mdp = dispatch => ({updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(UserPostContainer);