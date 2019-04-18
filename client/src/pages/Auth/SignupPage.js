import React, { Component } from "react";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import axios from "axios";
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    console.log(newUser);

    this.props.setUser(newUser);
    
    /* axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => {
        console.log(err.response.data);
        this.setState({ errors: err.response.data });
        console.log(this.state);
      }); */
  };

  render() {

    const { errors } = this.state;
    return (
      <div>
        <Form.Item
          hasFeedback
          validateStatus={errors.name ? "error" : ""}
          help={errors.name || ""}
        >
          <Input
            placeholder="Name"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            size="large"
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          validateStatus={errors.email ? "error" : ""}
          help={errors.email || ""}
        >
          <Input
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            size="large"
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          validateStatus={errors.password ? "error" : ""}
          help={errors.password || ""}
        >
          <Input
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            size="large"
            type="password"
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          validateStatus={errors.password2 ? "error" : ""}
          help={errors.password2 || ""}
        >
          <Input
            placeholder="Confirm password"
            name="password2"
            value={this.state.password2}
            onChange={this.onChange}
            size="large"
            type="password"
          />
        </Form.Item>

        <Button type="primary" block onClick={this.onSubmit} size="large">
          Submit
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
    return {
      setUser: (user) => dispatch({ type: actions.TEST_DISPATCH, user })
    };
  };

export default connect(null, mapDispatchToProps)(SignupPage);