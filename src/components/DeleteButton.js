import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from './MyPopup';

function DeleteButton({ postId , commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
	
	const [deletePostOrMutation] = useMutation(mutation, {
		variables: { 
			postId, 
			commentId 
		},
		update(proxy) {
			setConfirmOpen(false);

			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});
	
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data : {
						getPosts: data.getPosts.filter(p => p.id !== postId)
					}
				});	
			}
		
			if (callback) callback();
		}
	});

    return(
		<>
			<MyPopup 
				content={commentId ? "Delete comment" : "Delete post"}
				children={
					<Button 
						as="div" 
						color="red" 
						floated="right"
						onClick={() => setConfirmOpen(true)}
					>
						<Icon name="trash" style={{margin:0}}/>
					</Button>
				}
			/>	
			<Confirm 
				open={confirmOpen}
				size="mini"
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	)
}

const DELETE_POST_MUTATION = gql`
	mutation($postId: ID!) {
		deletePost(postId: $postId)
	}
`

const DELETE_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id comments {
				id body createdAt
			}
		}
	}
`
export default DeleteButton;
