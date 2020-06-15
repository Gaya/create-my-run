# Create my Run

Generate your next run.

---

Source code for the Create My Run project hosted at [https://createmy.run](https://createmy.run).

Feel free to contribute.

## Useful commands

```
# install
npm install

# run server
npm run server

# run front end
npm start
```

## Configuration

To run this project locally you can create a file name `.env` in the root of your project and place
the following configuration in it.

```
# required for frontend linting
EXTEND_ESLINT=true

# node js app port
API_PORT=4000
# api the frontend application communicates with
REACT_APP_API=http://localhost:4000
# enable route result caching
ENABLE_CACHE=true
# allow external connections to API
ALLOW_EXTERNAL=true

# external api locations
ROUTE_API=https://api.location/route
LOCATIONS_API=https://api.location/location
```
