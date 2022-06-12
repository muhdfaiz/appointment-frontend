### Appointment Frontend

#### URL

```
Local URL
http://localhost:3001/
```

#### Requirement
- Node.js version >= 10.16.0 and above

#### Description

-   Use VueJS version 3 (Composition API) for Javascript Framework
-   Use Bootstrap version 5 for CSS Framework
-   Use vite for module bundler

#### Setup Instruction

1. Clone the repo or download  the repo.
```
git clone https://github.com/muhdfaiz/appointment-frontend.git
https://github.com/muhdfaiz/appointment-frontend/archive/refs/heads/master.zip
``` 
<br>

2. Install NPM packages.
```
npm install
```
<br>

3. Run application in development mode. Make sure you run `appointment-backend` repo first.
```
npm run dev
```
<br>

4. Open the web page

```
http://localhost:3001/register
```
<br>

5. Register new account. Click submit and you will be redirect to `appointments` page.
<br>

6. Create new appointment by going to the page below. You can view number of slots available for each date. Click on the number of slots you interested. List of time available will be appear and you need to select it.  After that click create.
```
http://localhost:3001/dashboard/appointments/create
```
<br>

7. You can see list of appointments available at the link below. You can reschedule, cancel the appointment and add to calendar by clicking the icon on the right side in the table
```
http://localhost:3001/dashboard/appointments
```
<br>

8. Build for production. The file will be in `dist` folder

```
npm run build
```
<br>

9. List of available URLs

```
http://localhost:3001/register - Register Page
http://localhost:3001/ - Login Page
http://localhost:3001/dashboard/appointments - List of user appointments
http://localhost:3001/dashboard/appointments/reschedule/62a60c24f24595ca146fa4bf - Reschedule appointment


```
