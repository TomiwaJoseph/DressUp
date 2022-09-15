pip install -r requirements.txt
python mysite/manage.py collectstatic --no-input
python manage.py migrate