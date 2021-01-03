import { gql, useMutation } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';

import MyPopup from '../components/MyPopup';

function LikeButton({user, post: { id, likes, likeCount }}) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		setLiked(!!(user && likes?.find(like => like.username === user.username)));
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: {postId: id}
	});

	function checkAndLikePost() {
		if (user) {
			likePost()
		}
	}

	const likeButton = user ? (		
		liked ? (
			<Button color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} color="teal" to="/login" basic>
			<Icon name="heart" />
		</Button>
	);
	return (
		<>
			<Button as ="div" color="teal" labelPosition="right" onClick={checkAndLikePost}>
				<MyPopup 
					content={liked ? "Unlike": "Like"}
					children={likeButton}
				/>
			</Button>
			
			<Label basic color="teal" pointing="left">
				{likeCount}
			</Label>
	  </>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id username
			}
			likeCount
		}
	}
`;

export default LikeButton;