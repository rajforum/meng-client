import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
 
import PostCard from '../components/PostCard';
import PostForm from "../components/PostForm";
import { Grid, Transition } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
	const { user } = useContext(AuthContext),
		{ loading, data: { getPosts: posts } = {}} = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">Recent Posts</Grid.Row>
			<Grid.Row>
				{
					user && (
						<Grid.Column>
							<PostForm />
						</Grid.Column>
					)
				}

				{
					loading ? (
						<h1>Posts loading....</h1>
					) : (
						<Transition.Group>
							{
								 posts && (
									posts.map(post => {
										return (
											<Grid.Column key={post.id} style={{marginBottom: 20}}>
												<PostCard post={post} />
											</Grid.Column>
										)
									})
								)
							}
						</Transition.Group>
					)
				}
			</Grid.Row>
		</Grid>
	);
}

export default Home;
