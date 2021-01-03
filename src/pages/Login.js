import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

function Login(props) {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: '',
		password: ''
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, {data: {login: userData}}) {
      		context.login(userData)
			props.history.push('/');
		},
		onError: (err) => {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function loginUserCallback() {
		return loginUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					type='text'
					label='Username'
					placeholder="Username..."
					name="username"
					value={values.username}
					error={!!errors.username}
					onChange={onChange}
				/>
				<Form.Input
					type='password'
					label='Password'
					placeholder="Password..."
					name="password"
					value={values.password}
					error={!!errors.password}
					onChange={onChange}
				/>
				<Button type='submit' primary>
					Login
				</Button>
			</Form>

			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map(err => {
							return (
								<li key={err}>{err}</li>
							)
						})}
					</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login(
		$username: String!
		$password: String!
	) {
		login(
      username: $username
      password: $password
		) {
			id
			email
			username 
			createdAt
			token
		}
	}
`;

export default Login;