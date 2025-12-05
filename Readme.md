# API Routes


| Method   | Route            | Description                                 |
| -------- | ---------------- | ------------------------------------------- |
| **POST** | `/auth/register` | Register a new user                         |
| **POST** | `/auth/login`    | Login → sets access + refresh token cookies |
| **POST** | `/auth/logout`   | Logout → clears cookies                     |
| **POST** | `/auth/refresh`  | Refresh token → generate new access token   |


| Method    | Route                  | Description                          |
| --------- | ---------------------- | ------------------------------------ |
| **GET**   | `/form/active`         | Fetch currently active dynamic form  |
| **GET**   | `/form/:id`            | Fetch a form by ID                   |
| **POST**  | `/form/create`         | Create a new form schema (Admin use) |


| Method   | Route                       | Description                                                              |
| -------- | --------------------------- | ------------------------------------------------------------------------ |
| **POST** | `/submission`               | Submit encrypted application + resume/photo (multipart + hybrid decrypt) |
| **GET**  | `/submission/allSubmission` | Get logged-in user's submissions                                         |
