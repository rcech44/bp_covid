FROM python:3.11-slim-bullseye

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY /django/bp/* .

EXPOSE 80
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]