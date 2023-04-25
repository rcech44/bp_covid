FROM python:3.11

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY django/bp/* /usr/src/app/
RUN ls

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]