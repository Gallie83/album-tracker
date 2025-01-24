# **VYNYL**

VYNYL is a platform for music lovers to share and rate albums together. At it's core it serves as a place where users can learn more about their favourite albums and create listening groups with other music enthusiasts to serve as a sort of 'Audio book-club'. This project has allowed me to blend my passion for software and music and I hope that others can enjoy using what I have enjoyed making!

VYNYL is built using the MERN stack with TypeScript, using the Last.fm Api for data on music albums and artists. This is still in early development and new features are actively being worked on.

# Contents

- [**Technologies Used**](#technologies-used)
  - [Languages](#languages)
  - [Version Control](#version-control)
  - [Database](#Database)
- [**Models**](#models)
  - [User](#user)
  - [Group](#group)

# Technologies Used

### Languages

- [HTML5](https://en.wikipedia.org/wiki/HTML) - Provides the frontend content and structure for the website.
- [CSS3](https://en.wikipedia.org/wiki/CSS) - Provides the all stylings throughout the website, using
  [Tailwind](https://tailwindcss.com/) for ease and efficiency.
- [JavaScript](https://en.wikipedia.org/wiki/JavaScript) - The foundational language for the website, powering the frontend with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) for type checking, and the backend with [Node.js](https://nodejs.org/en) and [Express](https://expressjs.com/).

### Version Control

- [Git](https://git-scm.com/) - Used for version control.
- [Github](https://github.com/) - Used to host and edit the website.

### Database

- [MongoDB](https://www.mongodb.com/) - NoSQL database used to store all user-related data.

- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) - A cloud-based database service used to host and manage the application's MongoDB data

### Login and Authentication

- [Amazon Web Services Cognito](https://aws.amazon.com/cognito/) - Used for all Login and Authentication.

### Testing

- [Jest](https://jestjs.io/) - JavaScript testing framework used for unit testing different elements of the application
- [Vitest](https://vitest.dev/) - Vite-native unit testing framework offering fast performance and built-in TypeScript support

### Coding tools

- [VSCode](https://code.visualstudio.com/) - Used for writing all the websites code.

### Receiving Feedback

- [nodemail](https://nodemailer.com/) - Used to receive feedback from users. nodemailer sends an email to my gmail account with the users email and their feedback.

[Back to top](#contents)

# Models

## User

- This schema defines the structure for storing user-related data such as their information, albums and groups in MongoDB

```
  - cognitoId: Identification used with Amazon Cognito
  - username: The user's chosen display name
  - email: User's email address
  - usersAlbums: An array of album that the user has listened to
    - title: Album title
    - artist: Artist name
    - id: Unique Hashed Id
    - rating: User's rating(optional)
    - dateListened: Date the album was added
  - usersSavedAlbums: Albums the user wants to bookmark for later
    - title: Album title
    - artist: Artist name
    - id: Unique Hashed Id
  - groups: Reference to the Group schema below
```

## Group

This schema is for groups that users can make together that serve as album-listening club

```
  - title: Album title
  - members: A reference to User schemas
  - albums: Albums that users have added for group listening
    - title: Album title
    - artist: Artist name
    - id: Unique Hashed Id
    - ratings: Member Ratings
      - user: Reference to User schema
      - rating: Album rating
    - dateListened: records date the users rated the album
```

[Back to top](#contents)
