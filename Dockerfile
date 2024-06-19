# Use the official Python image as a base image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

#Upgrade pip 
RUN python3 -m pip install --upgrade pip

#Try 
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Install Flask and other dependencies
RUN pip3 install -r requirements.txt


#Try
RUN pip3 install git+https://github.com/tflearn/tflearn.git


#Install Extra python dependency
RUN python3 -m spacy download en_core_web_sm

# Copy the content of the local src directory to the working directory
COPY ./app /app

# Expose port 5000 to the outside world
EXPOSE 5000

# Command to run the Flask application
CMD ["python3", "app.py"]
