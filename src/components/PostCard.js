import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton'
import DeleteButton from './DeleteButton';
import MyPopup from './MyPopup';

function PostCard({
	post : { id, body, username, createdAt, likeCount, commentCount, likes }
}) {
	const  { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated='right'
					size='mini'
					src='https://react.semantic-ui.com/images/avatar/large/molly.png'
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			
			<Card.Content extra>
				<Button as="div" labelPosition="right">
					<LikeButton user={user} post={{id, likes, likeCount}} />
				</Button>

				<Button as="div" labelPosition="right" as={Link} to={`posts/${id}`} >
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
					<DeleteButton postId={id}/>
				)}
			</Card.Content> 
		</Card>
	);
}

export default PostCard;