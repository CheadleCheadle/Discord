## Users

### Get Friends by Curr_User

Returns the friends of a user

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/curruser/friends
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Friends": [
        {
          "id": 1,
          "username": 1,
          "email": "1@1.com",
          "first_name": "first",
          "last_name": "last",
          "status": "friends"
        }
      ]
    }
    ```

## Servers

###  Get all Servers

Returns all Servers

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

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
          "members_num": 12
        }
      ]
    }
    ```

###  Get a Server by serverId

Returns a Single Server

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers/:serverId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Server":
        {
          "id": 1,
          "name": "People",
          "type": "public",
          "max_users": 30,
          "icon_url": "smthing.url",
          "description": "This discord is for people",
          "members_num": 12,
          "created_at": "2020-03-01",
          "Host": {
            "id": 1,
            "first_name": "Name1",
            "last_name": "Name2",
            "username": "Name12"
          },
          "Channels": {
            {
              "id": 1,
              "name": "channel1",
              "type": "text",
              "topic": "Pets",
              "server_id": 1
            }
          },
          "Members": [
            {
              "id": 1,
              "username": "username",
              "first_name": "first_name",
              "last_name": "last_name",
              "status": "member"
            }
          ]
        }
    }
    ```

## Channels

### Get all Channels By Server_ID

Returns all channels by server_id

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers/:serverId/channels/:channelId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Channels": [
        {
          "id": 1,
          "name": "Channel-1",
          "type": "text",
          "max_users": 30,
          "topic": "Pets",
          "active_status": true,
          "active_users_num": 12,
          "server_id": 2
        }
      ]
    }
    ```

### Get a Channel By channelId

Returns a single channel by channelId

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/channels/:channelId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Channel":
        {
          "id": 1,
          "name": "Channel-1",
          "type": "text",
          "max_users": 30,
          "topic": "Pets",
          "active_status": true,
          "active_users_num": 12,
          "server_id": 2,
          "active_subscribers": [
            {
              "id": 1,
              "user_name": "username"
            }
          ],
          "Messages": [
            {
              "id": 1,
              "user_id": 1,
              "channel_id": 1,
              "content": "texttextextexttext",
              "time_stamp": "2020-12-05"
            }
          ]
        }
    }
    ```


## Messages

### Get Messages by channelId

Returns the message history of a channel by channelId

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/channels/:channelId/messages
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Messages": [
        {
          "id": 1,
          "userId": 1,
          "channel_id": 1,
          "content": "text message goes here",
          "time_stamp": "2020-09-08"
        }
      ]
    }
    ```

### Get Messages by Between CurrUser and User by userId

Returns the message history of a channel by channelId

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/currUser/messages/:userId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Messages": [
        {
          "id": 1,
          "curr_user_id": 1,
          "friend_id": 1,
          "content": "text message goes here",
          "time_stamp": "2020-09-08"
        }
      ]
    }
    ```


### Get Messages by channelId

Returns the message history of a channel by channelId

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/channels/:channelId/messages
  * Body:

    ```json
    {

    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {

    }
    ```
