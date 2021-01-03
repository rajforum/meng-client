import React, { useContext, useRef, useState } from 'react';
import gql from "graphql-tag";
import { useMutation, useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Button, Card, Grid, Image, Icon, Label, Form } from 'semantic-ui-react';

import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../components/MyPopup';


function SinglePost(props) {
	const postId = props.match.params.postId;
	const { user } = useContext(AuthContext);
	const [comment, setComment] = useState("");
	const commentInputRef = useRef(null);

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		variables: {
			postId,
			body: comment
		},
		update(proxy, result){
		
			setComment("");
			commentInputRef.current.blur();
		}
	});
    const { data: { getPost } = {}} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
	});

	function deletePostCallback() {
		props.history.push("/");
	}

	let postMarkup;
    if (!getPost) {
        postMarkup = <p>Posts Loading ...</p>
    } else {
		const { id, username, body, likes, likeCount, commentCount, comments, createdAt } = getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							floated="right"
							size="small"
							src="https://react.semantic-ui.com/images/avatar/large/molly.png"
						/>
					</Grid.Column>

					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<Card.Content extra>
								<Button as="div" labelPosition="right">
									<LikeButton user={user} post={{id, likes, likeCount}} />
								</Button>

								<Button as="div" labelPosition="right" >
									<MyPopup 
										content="Comment on post"
										children={
											<Button color="blue" basic>
												<Icon name="comments" />
											</Button>
										}
									/>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>

								{user && user.username === username && (
									<DeleteButton postId={postId} callback={deletePostCallback}/>
								)}
							</Card.Content> 
						</Card>

						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div className="ui action input fluid">
											<input 
												type="text"
												name="comment"
												placeholder="Comment ..."
												value={comment}
												onChange={event => setComment(event.target.value)}
												ref={commentInputRef}
											/>
											<button 
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === "" }
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						
						{
							comments.map(comment => 
								(
									<Card fluid key={comment.id}>
										<Card.Content>
											{
												user && user.username === comment.username && (
													<DeleteButton postId={postId} commentId={comment.id}/>
												)
											}
											<Card.Header>{comment.username}</Card.Header>
											<Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
											<Card.Description>{comment.body}</Card.Description>
										</Card.Content>
									</Card>
								)
							)
						}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
    }

    return postMarkup;

}


const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id body username createdAt likeCount 
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
	}`;
	
const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id body username createdAt
			}
		}
	}
`;

export default SinglePost;