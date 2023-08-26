import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Import the 'auth' from the firebase.js file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('Logged in successfully');
      navigate('/home'); // Navigate to Home after successful login
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      message.success('Signed up successfully');
      navigate('/home'); // Navigate to Home after successful signup
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="Login / Sign Up">
        <Form>
          <Form.Item label="Email" className="login-form-item">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password" className="login-form-item">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item className="login-form-item">
            <Button type="primary" className="login-button" onClick={handleLogin}>
              Login
            </Button>
            <Button type="primary" className="login-button" onClick={handleSignup}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
