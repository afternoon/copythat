CopyThat
========

Request website copy changes by editing pages in your browser.

Firebase Data Model
-------------------

```json
{
  "organisations": {
    "org1": {
      "users": {
        "productOwner1": {
          "productOwner": true,
          "developer": false
        },
        "developer1": {
          "productOwner": false,
          "developer": true
        },
        "stakeholder1": {
          "productOwner": false,
          "developer": false
        }
      }
    }
  },
  "edits": {
    "org1": {
      "edit1": {
        "creator": "stakeholder1",
        "oldHTML": "",
        "newHTML": "",
        "time": "",
        "approver": "productOwner1"
      }
    }
  }
}
```
