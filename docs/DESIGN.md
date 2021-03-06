# Software Design

## Infrastructure

API --> API Gateway --> Lambda --> DynamoDB

Admin --> Cloudfront --> S3

## DB Design

![DB Design](img/db-design.png)

### Access Patters

* Users
  * List sorted by name (/api/users)
    * gs1pk: "user"
  * Login, update, get user (/api/users/:email):
    * pk: "email"
    * sk: "user"
* Page Definition
  * List sorted by name (/api/page-definition)
    * gs1pk: "page"
  * Get or update page (/api/page-definition/:id)
    * pk: ":page-id"
    * sk: "page"
* Page Data
  * List sorted by name (/api/pages)
    * gs1pk: "page#data"
  * Get or update page data (/api/pages/:id)
    * pk: ":id"
    * sk: "page#data"
* Content Definition
  * List sorted by name (/api/content-definition)
    * gs1pk: "content"
  * Get or update content type: (/api/content-definition/:type)
    * pk: ":type"
    * sk: "content"
* Content Data
  * List sorted as defined by sort-key attribute (/api/contents/:type)
    * gs1pk: "content#:type"
  * Get or update content data (/api/contents/:type/:slug)
    * pk: ":slug"
    * sk: "content#:type"

*Note that **slug** and **sort-key** are mandatory in Content Types.*

## Notes

* I've also considered using [SAM](https://docs.aws.amazon.com/en_pv/serverless-application-model/latest/developerguide/what-is-sam.html) but local development is too slow because it needs to rebuild on every code change and running ```sam local start-api``` server response is like a simulation of lambda cold start on every request. Also deployment has too many steps compared to [serverless](https://www.npmjs.com/package/serverless).