FROM python:3.10

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip

RUN pip install -r /app/requirements.txt

EXPOSE 8888

CMD ["python3" ,  "/app/src/app.py"]