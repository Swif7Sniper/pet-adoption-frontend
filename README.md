# SEF-Project starter repository Spring 2025

## Brief Project Documentation
Add the required details as listed in the Project Specification

### Group Name:

- PAR Group 12

### Group Member List:
List the **names** and **Student ID** for each team member.

1. **Student 1**: Hannah Cruz 19865209
2. **Student 2**: Kanika Arun 22082203
3. **Student 3**: Raghav Sood 22039736
4. **Student 4**: Zaara Hoque 22203246
----  

### Installation and setup instructions.
Detail any relevant instructions that the marker will need to follow to set up your Django project for marking.

Use these to log into the site quickly:

-admin_account
username:raghav
email:raghav@gmail.com
password:Password650$

-test_account_registeredadopter:
email:moey@gmail.com
password:Password650$

 1. Go into the project folder
cd sefgroupproject-spring2025-PAR-group-12

2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
# .venv\Scripts\activate    # Windows PowerShell

3. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt


If requirements.txt is missing:

pip install "Django>=5.2,<6" Pillow

4. Prepare the database
python manage.py makemigrations hiking
python manage.py migrate

5. Create users

Create a superuser for staff/admin functions:

python manage.py createsuperuser


Optionally, create a test adopter account:

python manage.py shell -c "from django.contrib.auth import get_user_model as g; g().objects.create_user('adopter','adopter@example.com','pass1234!')"

6. Run the development server
python manage.py runserver


Visit: http://127.0.0.1:8000/

Home page → /

Pet list → /pets/

Pet detail → /pets/<id>/

Apply for adoption → /pets/<id>/apply/ (login required)

Review applications → /review-applications/ (staff only)

7. Run the automated tests
python manage.py test hiking


This will run:

Model tests → confirm field persistence and relationships

View tests → check responses, permissions, and view logic

Form tests → ensure form validation works (valid/invalid data)
----

### Brief user guide for using the application.
#### Landing Page

- HTML/index.html

#### Main web pages and their purpose

- index.html -- landing page, introduction to Penny's Pet Rescue.
- userCreation.html -- form for creating a new user
- pet_search_browse_form.html -- form to search pets currently in database
- ReviewAdoptionApplicationForm.html -- form for Penny to review adoption applications
- adoption_application_form.html -- form to apply for an adoption
- userLogin.html -- user login form
- assign_volunteers_permissions_form.html -- for Penny to assign privilges to staff
----

#### User credentials and their associated roles.
Ensure that the passwords are listed in **plain text**. All users that you have created in your database **must** be included.

- Penny (Admin): 
- John (Privileged Staff):
- Jane (Normal Staff):
- Joe (Customer/Potential Adopter):
----




