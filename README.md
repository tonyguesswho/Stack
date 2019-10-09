# Stack

A Stack-Overflow(Clone) Rest API

[![Build Status](https://travis-ci.org/tonyguesswho/Stack.svg?branch=develop)](https://travis-ci.org/tonyguesswho/Stack) [![Coverage Status](https://coveralls.io/repos/github/tonyguesswho/Stack/badge.svg?branch=master)](https://coveralls.io/github/tonyguesswho/Stack?branch=develop)

## features

- [x] Users can ask a question
- [x] Users can view all questions
- [x] Users can view a particular question
- [x] Users can answer questions
- [x] Users can search for questions, Answers and other users
- [x] Users can upvote/downvote questions
- [x] Users can subscribe to a question
- [x] Users can register/login
- [x] Users can unsubscribe from a question

## Root Endpoint(Hosted on Heroku)

[https://my-stack-clone.herokuapp.com/]

## API Endpoint

[https://my-stack-clone.herokuapp.com/api/v1]

## API Documentation

API documenntation(Postman): [https://documenter.getpostman.com/view/5795018/SVtSXqNP]

## Getting started

### Technologies Used

- Node JS
- MongoDB
- Travis CI
- Mocha and Chai

### Prerequisites

In order to install and run this project locally, you would need to have the following installed on you local machine.

- [**Node JS**](https://nodejs.org/en/)
- [**MONGODB**](https://www.mongodb.com/download-center)

### Installation

- Clone this repository

```sh
git clone [https://github.com/tonyguesswho/Stack.git]
```

- Navigate to the project directory

* Run `npm install` or `yarn` to instal the projects dependencies
* create a `.env` file and copy the contents of the `.env.example` file into it and supply the values for each variable

- Tests

* Run `npm run test`

## API Endpoints Summary

- For sample responses check the post man API documentation : [https://documenter.getpostman.com/view/5795018/SVtSXqNP]
  <table>
    <tr>
        <th>Request</th>
        <th>End Point</th>
        <th>Action</th>
        <th>Required</th>
    </tr>
      <tr>
        <td>POST</td>
        <td>/api/v1/users/signup</td>
        <td>Register a User</td>
        <td>name, email, password , confirmPassword</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/users/login</td>
      <td>Login a user</td>
      <td>email, password</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/questions</td>
      <td>Ask a Question</td>
      <td>title, body</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/questions</td>
      <td>Get all questions</td>
      <td></td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/questions/:questionId</td>
      <td>Get a single question</td>
      <td>QuestionId param</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/questions/:questionId/answer</td>
      <td>Answer a question</td>
      <td>QuestionId param, Auth Token(Bearer `token`)</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/questions/questionID/vote</td>
      <td>Upvote or Downvote a question</td>
      <td>QuestionId param, Auth Token(Bearer `token`)</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/questions/questionId/subscribe</td>
      <td>Subscribe to a question</td>
      <td>QuestionId param, Auth Token(Bearer `token`)</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/api/v1/questions/questionId/subscribe</td>
      <td>Unsubscribe from a question</td>
      <td>QuestionId param, Auth Token(Bearer `token`)</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/search?question='test'</td>
      <td>Search for question</td>
      <td>question query string</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/search?answer='test'</td>
      <td>Search for answer</td>
       <td>answer query string</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/search?user='test'</td>
      <td>Search for User</td>
       <td>name query string</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/questions?sort=title</td>
      <td>Sort Questions(Get all questions sorted by any field)</td>
       <td>Sort field</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/questions?fields=body</td>
      <td>Select Fields(Get all questions with desired  fields only)</td>
      <td>Required fields</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/questions?page=1&limit=1</td>
      <td>Paginate Questions(Paginate while getting all fields)</td>
      <td>page and limit</td>
    </tr>
     <tr>
      <td>GET</td>
      <td>/api/v1/questions?title=first</td>
      <td>flter Questions</td>
      <td>filter field</td>
    </tr>
  </table>
