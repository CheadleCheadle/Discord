# Server

## Get all Server

Returns all the servers.

- Require Authentication: True(logined already)

- Request

  - Method: GET
  - URL: /api/servers
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:

    - Content-Type: application/json

  - Body:

    ```json
    {
     "Servers": [
      {
       "id": 1,
       "name": "People",
       "type": "public",
       "max_users": 30,
       "topic": "Pets",
       "icon_url": "smthing.url",
       "description": "This discord is for people",
       "server_id": 2,
       "owner_id": 1,
       "created_at": "2021-11-19 20:39:36",
       "members_num": 12
      }
     ]
    }
    ```

## Get all the servers the current user joined in.

- Require Authentication: True(logined already)

- Request

  - Method: GET
  - URL: /api/servers/current
  - Body: none

- Successful Response

  - Status Code: 200

  - Headers:

    - Content-Type: application/json

  - Body:

    ```json
    {
     "Servers": [
      {
       "id": 1,
       "name": "People",
       "type": "public",
       "max_users": 30,
       "topic": "Pets",
       "icon_url": "smthing.url",
       "description": "This discord is for people",
       "owner_id": 1,
       "created_at": "2021-11-19 20:39:36",
       "members_num": 12
      }
     ]
    }
    ```

### Create a Server

Creates and returns a new spot.

- Require Authentication: True(logined already)
- Request

  - Method: POST
  - URL: /api/servers
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
     "Servers": [
      {
       "name": "People",
       "type": "public",
       "max_users": 30,
       "topic": "Pets",
       "icon_url": "smthing.url",
       "description": "This discord is for people",
       "owner_id": 1
      }
     ]
    }
    ```

* Successful Response
  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

```json
{
 "Servers": [
  {
   "id": 1,
   "name": "People",
   "type": "public",
   "max_users": 30,
   "topic": "Pets",
   "icon_url": "smthing.url",
   "description": "This discord is for people",
   "owner_id": 1,
   "created_at": "2021-11-19 20:39:36"
  }
 ]
}
```

- Error Response: Body validation error

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
   "Servers": [
    {
     "message": "Validation Error",
     "statusCode": 400,
     "errors": {
      "name": "name is required",
      "type": "type is required",
      "max_users": "max_users is required",
      "topic": "topic is required",
      "icon_url": "icon_url is required",
      "description": "description is required",
      "owner_id": "owner_id is required"
     }
    }
   ]
  }
  ```

### Edit a Server

Updates and returns an existing server.

- Require Authentication: True(logined already)
- Require proper authorization: Server must belong to the current user
- Request

  - Method: PUT
  - URL: /api/servers/:serverId/edit
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
     "Servers": [
      {
       "name": "People",
       "type": "public",
       "max_users": 30,
       "topic": "Pets",
       "icon_url": "smthing.url",
       "description": "This discord is for people",
       "owner_id": 1
      }
     ]
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

```json
{
 "Servers": [
  {
   "id": 1,
   "name": "People",
   "type": "public",
   "max_users": 30,
   "topic": "Pets",
   "icon_url": "smthing.url",
   "description": "This discord is for people",
   "owner_id": 1,
   "created_at": "2021-11-19 20:39:36"
  }
 ]
}
```

- Error Response: Body validation error

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
   "Servers": [
    {
     "message": "Validation Error",
     "statusCode": 400,
     "errors": {
      "name": "name is required",
      "type": "type is required",
      "max_users": "max_users is required",
      "topic": "topic is required",
      "icon_url": "icon_url is required",
      "description": "description is required",
      "owner_id": "owner_id is required"
     }
    }
   ]
  }
  ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
     "message": "Server couldn't be found",
     "statusCode": 404
    }
    ```

### Delete a Server

Deletes an existing server.

- Require Authentication: True(logined already)
- Require proper authorization: Server must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/servers/:serverId/delete
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
     "message": "Successfully deleted",
     "statusCode": 200
    }
    ```

- Error response: Couldn't find a Server with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
     "message": "Server couldn't be found",
     "statusCode": 404
    }
    ```
