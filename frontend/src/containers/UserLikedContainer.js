// imports
import PostPreview from '../components/PostPreview';
import UserShellContainer from './UserShellContainer';
import { updateFollows } from '../redux/actions';
import { connect } from 'react-redux';
// end of imports ------------------------------------------------------



// normally like to write all functional components but wanted to demonstratea little knowledge of also class based too
// I used UserShellContainer as a parent for UserLikedContainer and UserPostContainer since they are similair
// class based doesnt seem to play so nicely with redux
class UserLikedContainer extends UserShellContainer {

    // for page header
    headerChange = 'Likes:'

   // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.likedPosts)
        return this.state.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}

const msp = state => ({ loggedUser: state.user.user })
const mdp = dispatch => ({ updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(UserLikedContainer);